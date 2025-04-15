'use client';

import React, {useState} from 'react';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: 'Project name must be at least 2 characters.',
  }),
  moduleName: z.string().min(2, {
    message: 'Module name must be at least 2 characters.',
  }),
  functionalRequirementsCsv: z.instanceof(File).nullable().refine(file => file === null || file.size <= 1000000, `Max file size is 1MB.`),
});

interface ProjectConfigurationFormProps {
  onSubmit: (values: { projectName: string; moduleName: string; functionalRequirementsCsvContent: string }) => void;
}

export const ProjectConfigurationForm: React.FC<ProjectConfigurationFormProps> = ({onSubmit}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      moduleName: '',
      functionalRequirementsCsv: null,
    },
  });

  const submitHandler = async (values: z.infer<typeof formSchema>) => {
    if (!values.functionalRequirementsCsv) {
      console.warn('No file selected');
      onSubmit({
        projectName: values.projectName,
        moduleName: values.moduleName,
        functionalRequirementsCsvContent: '',
      });
      return;
    }

    const file = values.functionalRequirementsCsv;
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const fileContent = event.target.result as string;
        onSubmit({
          projectName: values.projectName,
          moduleName: values.moduleName,
          functionalRequirementsCsvContent: fileContent,
        });
      } else {
        console.error('Failed to read file content.');
      }
    };

    reader.onerror = (error: ProgressEvent<FileReader>) => {
      console.error('Error reading file:', error);
    };

    reader.readAsText(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="projectName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="My Commerce Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moduleName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Module Name</FormLabel>
              <FormControl>
                <Input placeholder="MyModule" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="functionalRequirementsCsv"
          render={({field}) => (
            <FormItem>
              <FormLabel>Functional Requirements CSV File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      field.onChange(e.target.files[0]);
                    } else {
                      field.onChange(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Configure Project</Button>
      </form>
    </Form>
  );
};

export default ProjectConfigurationForm;