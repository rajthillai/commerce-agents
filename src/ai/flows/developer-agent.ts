'use server';
/**
 * @fileOverview An AI agent that develops Adobe Commerce modules based on the technical approach.
 *
 * - developCommerceModule - A function that handles the module development process.
 * - DevelopCommerceModuleInput - The input type for the developCommerceModule function.
 * - DevelopCommerceModuleOutput - The return type for the DevelopCommerceModule function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {parse} from 'csv-parse';
import { writeFilesToCommerceDir } from '@/lib/file-utils';

const DevelopCommerceModuleInputSchema = z.object({
  technicalApproachCsvPath: z.string().describe('The CSV data containing the technical approach.'),
  moduleName: z.string().describe('The name of the Adobe Commerce module to be developed.'),
  projectName: z.string().describe('The name of the project.'),
});
export type DevelopCommerceModuleInput = z.infer<typeof DevelopCommerceModuleInputSchema>;

const DevelopCommerceModuleOutputSchema = z.object({
  modulePath: z.string().describe('The path to the generated module files.'),
  moduleCode: z.string().describe('The generated module code.'),
  success: z.boolean().describe('Whether the module generation was successful.'),
  message: z.string().describe('A message indicating the status of the module generation.'),
});
export type DevelopCommerceModuleOutput = z.infer<typeof DevelopCommerceModuleOutputSchema>;

export async function developCommerceModule(input: DevelopCommerceModuleInput): Promise<DevelopCommerceModuleOutput> {
  return developCommerceModuleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'developCommerceModulePrompt',
  input: {
    schema: z.object({
      technicalApproachCsvPath: z.string().describe('The CSV data containing the technical approach.'),
      moduleName: z.string().describe('The name of the Adobe Commerce module to be developed.'),
      projectName: z.string().describe('The name of the project.'),
    }),
  },
  output: {
    schema: z.object({
      fileContents: z.array(z.object({
        filePath: z.string().describe('The path to the generated file.'),
        code: z.string().describe('The generated file code.'),
      })).describe('An array of file paths and their corresponding code.'),
      success: z.boolean().describe('Whether the module generation was successful.'),
      message: z.string().describe('A message indicating the status of the module generation.'),
    }),
  },
  prompt: `You are an experienced Adobe Commerce developer tasked with creating a module based on a technical approach described in a CSV file.

  The technical approach for module {{{moduleName}}} is available in the following CSV data: {{{technicalApproachCsvPath}}}.

  Your task is to generate the complete code for the module, ensuring it adheres to Adobe Commerce best practices and coding standards.

  Requirements:
  1. Follow Magento 2 coding standards strictly
  2. Include appropriate PHPDoc comments for all classes and methods
  3. Add proper file headers with copyright and license information
  4. Create a comprehensive README.md file
  5. Generate PHPUnit tests for all classes
  6. Include proper type hints and return types
  7. Follow PSR-12 coding standards
  8. Use dependency injection for all dependencies
  9. Implement proper exception handling
  10. Add proper logging where necessary
  11. Use the latest version of Magento 2
  12. Use the latest version of PHP

  For each file, include:
  1. File header with copyright and license information
  2. PHPDoc comments for classes and methods
  3. Type hints and return types
  4. Proper exception handling
  5. Logging where appropriate

  For the module, include:
  1. README.md with:
     - Module description
     - Installation instructions
     - Configuration details
     - Usage examples
     - Testing instructions
  2. composer.json with proper dependencies
  3. registration.php
  4. etc/module.xml
  5. Test classes in Test/Unit and Test/Integration directories

  The technical approach is in CSV format, read it carefully to determine the implementation.
  Each row in the CSV represents a file to be created. The CSV includes the file path and code for each file.

  IMPORTANT: When generating file paths, always use the full path starting with Vendor/ModuleName/.
  For example:
  - Instead of: Model/Carrier.php
  - Use: Vendor/ModuleName/Model/Carrier.php

  Generate a list of filepaths and contents for all files to create.
  Return the success status and a message indicating the status.
  If something is missing, or you can not successfully generate the module based on the CSV information, return success as false.
  `,
});

const developCommerceModuleFlow = ai.defineFlow<
  typeof DevelopCommerceModuleInputSchema,
  typeof DevelopCommerceModuleOutputSchema
>(
  {
    name: 'developCommerceModuleFlow',
    inputSchema: DevelopCommerceModuleInputSchema,
    outputSchema: DevelopCommerceModuleOutputSchema,
  },
  async input => {
    try {
      const {technicalApproachCsvPath, moduleName, projectName} = input;

      // Call the prompt to generate the module code
      const {output} = await prompt({
        technicalApproachCsvPath,
        moduleName,
        projectName,
      });

      if (!output) {
        return {
          modulePath: '',
          moduleCode: '',
          success: false,
          message: 'Failed to generate module code.',
        };
      }

      // Write files to Commerce directory
      const writeResult = await writeFilesToCommerceDir(output.fileContents);

      // Create a string containing all file contents for display
      let allModuleCode = '';
      if (output.fileContents && output.fileContents.length > 0) {
        output.fileContents.forEach(file => {
          allModuleCode += `FILE: ${file.filePath}\n${file.code}\n\n`;
        });
      } else {
        return {
          modulePath: '',
          moduleCode: '',
          success: false,
          message: 'No files were generated.',
        };
      }

      return {
        modulePath: writeResult.success ? 'Files written to Commerce directory' : '',
        moduleCode: allModuleCode,
        success: writeResult.success,
        message: writeResult.message,
      };
    } catch (error: any) {
      console.error('Error in developCommerceModuleFlow:', error);
      return {
        modulePath: '',
        moduleCode: '',
        success: false,
        message: `Module generation failed: ${error.message ?? 'Unknown error'}`,
      };
    }
  }
);
