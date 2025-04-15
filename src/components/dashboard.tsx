'use client';

import React from 'react';
import {Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {generateTechnicalApproach} from '@/ai/flows/technical-architect';
import {developCommerceModule} from '@/ai/flows/developer-agent';
import {Textarea} from "@/components/ui/textarea";
import {ProjectConfigurationForm} from "@/components/project-configuration-form";
import {OutputReview} from '@/components/output-review';
import { config } from '@/lib/config';

const Dashboard: React.FC = () => {
  const {toast} = useToast();
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [agentStatus, setAgentStatus] = useState({
    technicalArchitect: 'idle',
    developerAgent: 'idle',
  });
  const [moduleCode, setModuleCode] = useState('');
  const [functionalRequirementsCsvContent, setFunctionalRequirementsCsvContent] = useState('');
  const [modulePath, setModulePath] = useState('');
  const [technicalApproachCsvContent, setTechnicalApproachCsvContent] = useState('');

  const handleConfigurationSubmit = async (values: { projectName: string; moduleName: string; functionalRequirementsCsvContent: string }) => {
    setProjectName(values.projectName);
    setModuleName(values.moduleName);
    setFunctionalRequirementsCsvContent(values.functionalRequirementsCsvContent);
    toast({
      title: 'Project Configured',
      description: `Project "${values.projectName}" configured with module "${values.moduleName}".`,
    });
  };


  const handleGenerateTechnicalApproach = async () => {
    setAgentStatus({...agentStatus, technicalArchitect: 'running'});
    try {
      const result = await generateTechnicalApproach({csvData: functionalRequirementsCsvContent});
      setTechnicalApproachCsvContent(result.technicalApproachCsvContent);
      setAgentStatus(prev => ({...prev, technicalArchitect: 'done'}));
      toast({
        title: 'Technical Approach Generated',
        description: 'Technical approach generated successfully.',
      });
    } catch (error: any) {
      console.error('Error generating technical approach:', error);
      setAgentStatus({...agentStatus, technicalArchitect: 'error'});
      toast({
        title: 'Error',
        description: `Failed to generate technical approach: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleDevelopCommerceModule = async () => {
    setAgentStatus({...agentStatus, developerAgent: 'running'});
    try {
      const result = await developCommerceModule({
        technicalApproachCsvPath: technicalApproachCsvContent,
        moduleName,
        projectName,
      });
      setModuleCode(result.moduleCode);
      setModulePath(result.modulePath);
      setAgentStatus(prev => ({...prev, developerAgent: result.success ? 'done' : 'error'}));
      toast({
        title: result.success ? 'Module Generated' : 'Error',
        description: result.message,
      });
    } catch (error: any) {
      setAgentStatus(prev => ({...prev, developerAgent: 'error'}));
      toast({
        title: 'Error',
        description: `Failed to generate module: ${error.message}`,
      });
    }
  };

  const handleExport = () => {
    if (moduleCode) {
      const blob = new Blob([moduleCode], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${moduleName}.txt`; // Set the file name to moduleName.txt
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      toast({
        title: 'Error',
        description: 'No module generated yet.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenCommerceDir = () => {
    // Open the Commerce directory in the file explorer
    window.open(`file://${config.commerceSrcDir}`, '_blank');
  };

  useEffect(() => {
    router.refresh();
  }, [agentStatus, router]);

  return (
    <div className="flex h-screen antialiased text-foreground">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <h1 className="text-xl font-semibold">CommerceCraft AI</h1>
          <p className="text-sm text-muted-foreground">Crafting Commerce with AI</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Project Settings</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Agent Management</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarContent className="flex flex-col">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-4">Project Dashboard</h1>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Project Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectConfigurationForm onSubmit={handleConfigurationSubmit} />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Architect Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {agentStatus.technicalArchitect}</p>
                <Button onClick={handleGenerateTechnicalApproach} disabled={agentStatus.technicalArchitect === 'running'}>
                  Generate Technical Approach
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Developer Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {agentStatus.developerAgent}</p>
                <Button onClick={handleDevelopCommerceModule} disabled={agentStatus.developerAgent === 'running'}>
                  Develop Commerce Module
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* <Card className="mb-4">
            <CardHeader>
              <CardTitle>Generated Technical Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={technicalApproachCsvContent} readOnly className="mb-4" />
            </CardContent>
          </Card> */}
          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              {moduleCode ? (
                <>
                  <p>Module generated successfully!</p>
                  <div className="flex gap-4 mt-4">
                    <Button onClick={handleExport}>Export Module Code</Button>
                    <Button onClick={handleOpenCommerceDir} variant="outline">
                      Open Commerce Directory
                    </Button>
                  </div>
                  {modulePath && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>File Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{modulePath}</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <p>No module generated yet.</p>
              )}
            </CardContent>
          </Card>
          <h1 className="text-2xl font-bold mt-4 mb-4">Output Review</h1>
          <OutputReview moduleCode={moduleCode} />
        </div>
      </SidebarContent>
    </div>
  );
};

export default Dashboard;
