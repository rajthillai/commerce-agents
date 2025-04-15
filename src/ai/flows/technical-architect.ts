'use server';

/**
 * @fileOverview An AI agent that generates a detailed technical approach for Adobe Commerce application development.
 *
 * - generateTechnicalApproach - A function that generates the technical approach.
 * - GenerateTechnicalApproachInput - The input type for the generateTechnicalApproach function.
 * - GenerateTechnicalApproachOutput - The return type for the generateTechnicalApproach function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {parse} from 'csv-parse';

const GenerateTechnicalApproachInputSchema = z.object({
  csvData: z
    .string()
    .describe('The CSV data as a string.'),
});
export type GenerateTechnicalApproachInput = z.infer<typeof GenerateTechnicalApproachInputSchema>;

const GenerateTechnicalApproachOutputSchema = z.object({
  technicalApproachCsvContent: z
    .string()
    .describe('The CSV content with an additional column for the technical approach.'),
});
export type GenerateTechnicalApproachOutput = z.infer<typeof GenerateTechnicalApproachOutputSchema>;

export async function generateTechnicalApproach(
  input: GenerateTechnicalApproachInput
): Promise<GenerateTechnicalApproachOutput> {
  return generateTechnicalApproachFlow(input);
}

const addTechnicalApproachColumnTool = ai.defineTool({
  name: 'addTechnicalApproachColumn',
  description: 'Adds a new column to the CSV data with the technical approach for each functional requirement.',
  inputSchema: z.object({
    functionalRequirement: z.string().describe('The functional requirement from the CSV.'),
  }),
  outputSchema: z.string().describe('The technical approach for the functional requirement.'),
},
async input => {
  // Improved technical approach generation
  const approach = `
  1. **Functional Requirement**: ${input.functionalRequirement}

  2. **Overall Approach**: 
     - Provide a high-level strategy to address the requirement, including key steps and considerations.  Explain what needs to be done at a high level.

  3. **Module Selection/Creation**:
     - Determine if the functionality can be achieved by extending existing modules or if a new module is needed.
     - If extending existing modules, identify those modules and provide extension strategies (plugins, observers, preferences, etc.).
     - If a new module is needed, provide the module name (e.g., Vendor_ModuleName) and a brief description of its purpose.

  4. **File Paths and Structure**:
     - List the specific file paths that will be created or modified, including:
       - Controller files (e.g., Vendor/Module/Controller/Action/ActionName.php)
       - Block files (e.g., Vendor/Module/Block/BlockName.php)
       - Layout XML files (e.g., Vendor/Module/view/frontend/layout/layout_handle.xml)
       - Template files (e.g., Vendor/Module/view/frontend/templates/template.phtml)
       - Model files (e.g., Vendor/Module/Model/ModelName.php)
       - Helper files (e.g., Vendor/Module/Helper/Data.php)
       - UI Component files (e.g., Vendor/Module/view/frontend/ui_component/component.xml)
       - Install/Upgrade Schema files (e.g., Vendor/Module/Setup/InstallSchema.php, Vendor/Module/Setup/UpgradeSchema.php)
       - Web API configuration (e.g., Vendor/Module/etc/webapi.xml)
       - Message Queue configuration (e.g., Vendor/Module/etc/queue.xml)
       - Data Patch files (e.g., Vendor/Module/Setup/Patch/Data/PatchName.php)
       - Declarative Schema files (e.g., Vendor/Module/etc/db_schema.xml)
       - CRON configuration files (e.g., Vendor/Module/etc/crontab.xml)
       - Configuration files (e.g., Vendor/Module/etc/config.xml)
       - System configuration files (e.g., Vendor/Module/etc/adminhtml/system.xml)
     - Ensure to cover both frontend and backend areas if applicable.

  5. **Code Snippets and Core Module References**:
     - Provide code snippets illustrating key parts of the implementation. Emphasize the logic for each file.
     - Reference core module classes or methods that will be used or extended. For example: \\Magento\\Catalog\\Model\\Product.

  6. **Database Changes**:
     - Describe any database schema changes required, including new tables, columns, or indexes. Provide the necessary SQL schema.

  7. **Configuration**:
     - Mention any configuration settings needed (e.g., system.xml, config.xml). Include the XML configuration.

  8. **Dependencies**:
     - List any module dependencies required.  Explain the module version compatiblity if possible.

  9. **Events/Observers**:
     - Specify any events that will be dispatched or observed. Explain the observer logic.

  10. **Security Considerations**:
      - Any particular security aspects to consider during development, such as data validation, escaping, access control, or protection against common web vulnerabilities.

  11. **Testing Considerations**:
      - Outline the testing strategy, including unit tests, integration tests, and functional tests.  Specify the testing frameworks to be used.

  Example:
  1. Functional Requirement: Create a new module to display product reviews.

  2. Overall Approach: Implement a new module to display product reviews on the product detail page. Use a block to retrieve reviews and display them in a template.  The block will fetch the data from database and the template will display the data.

  3. Module: Vendor_ProductReviews

  4. File Paths:
     - Vendor/ProductReviews/Controller/Index/Index.php
     - Vendor/ProductReviews/Block/Product/View.php
     - Vendor/ProductReviews/view/frontend/layout/catalog_product_view.xml
     - Vendor/ProductReviews/view/frontend/templates/product/view.phtml

  5. Code Snippets and Core Module References:
     - Vendor/ProductReviews/Block/Product/View.php:
     \`\`\`php
     <?php
     namespace Vendor\ProductReviews\Block\Product;

     use Magento\Framework\View\Element\Template;
     use Magento\Catalog\Model\Product;

     class View extends Template
     {
         public function __construct(
             Template\Context $context,
             array $data = []
         ) {
             parent::__construct($context, $data);
         }

         public function getReviews()
         {
             // Logic to fetch reviews from database
             return [
                 ['author' => 'John Doe', 'review' => 'Great product!'],
                 ['author' => 'Jane Smith', 'review' => 'Highly recommended.']
             ];
         }
     }
     \`\`\`

  6. Database Changes:
     - No database changes required for this functionality.

  7. Configuration:
     - No specific configuration settings needed.

  8. Dependencies:
     - Magento\\Catalog (for product information).

  9. Events/Observers:
     - No events or observers are used in this module.

  10. Security Considerations:
      - Ensure proper data validation and escaping to prevent XSS vulnerabilities.

  11. Testing Considerations:
      - Implement unit tests to verify the block logic.
      - Create integration tests to ensure the module functions correctly with the catalog module.
  `;
  return approach;
});

const prompt = ai.definePrompt({
  name: 'technicalArchitectPrompt',
  tools: [addTechnicalApproachColumnTool],
  input: {
    schema: z.object({
      csvData: z.string().describe('The CSV data as a string.'),
    }),
  },
  output: {
    schema: z.object({
      technicalApproachCsvContent: z
        .string()
        .describe('The CSV content with an additional column for the technical approach.'),
    }),
  },
  prompt: `You are an AI Technical Architect Agent with 15+ years of experience in Adobe Commerce and architecture design principles.
Your task is to generate a detailed and structured technical approach for each functional requirement provided in a CSV file.

The CSV data is: {{{csvData}}}.

Read the CSV data and, for each functional requirement, use the 'addTechnicalApproachColumn' tool to generate the technical approach.
Then, create a new CSV content string with the original data and the additional 'technical_approach' column.
The technical approach must be detailed and deeply driven for the developer agent to generate clean code, include specific file paths, code snippets, core module references, database changes, configuration, dependencies, events/observers, security consideration and testing considerations.
The output should be structured into the sections like Overall approach, Module, File paths and structure, Code snippets and core module references, Database changes, Configuration, Dependencies, Events/Observers, Security considerations and Testing consideration.
`,
});

const generateTechnicalApproachFlow = ai.defineFlow<
  typeof GenerateTechnicalApproachInputSchema,
  typeof GenerateTechnicalApproachOutputSchema
>(
  {
    name: 'generateTechnicalApproachFlow',
    inputSchema: GenerateTechnicalApproachInputSchema,
    outputSchema: GenerateTechnicalApproachOutputSchema,
  },
  async input => {
    try {
      const {csvData} = input;

      if (!csvData || csvData.trim() === '') {
        throw new Error("CSV data is empty.");
      }

      // Parse the CSV data
      const records = await new Promise<any[]>((resolve, reject) => {
        parse(csvData, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        }, (err, records) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        });
      });

      // Prepare the header row for the new CSV content
      if (!records || records.length === 0) {
          throw new Error("No records found in the CSV data.");
      }
      const headerRow = Object.keys(records[0]).join(',') + ',technical_approach\n';
      let csvContent = headerRow;

      // Process each record and add the technical approach
      for (const record of records) {
        const functionalRequirement = record[Object.keys(record)[0]]; // Assuming the first column is the functional requirement
        const technicalApproach = await addTechnicalApproachColumnTool({functionalRequirement});

        // Create a row with the original data and the new technical approach
        const row = Object.values(record).map(value => `"${value}"`).join(',') + `,"${technicalApproach}"\n`;
        csvContent += row;
      }

      return {
        technicalApproachCsvContent: csvContent,
      };
    } catch (error: any) {
      console.error('Error in generateTechnicalApproachFlow:', error);
      let errorMessage = 'Failed to generate technical approach';
      if (error instanceof Error) {
          errorMessage += `: ${error.message}`;
      } else {
          errorMessage += `: ${JSON.stringify(error)}`; // Fallback in case it's not an Error instance
      }
      throw new Error(errorMessage);
    }
  }
);
