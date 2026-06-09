
"use client";

import type { JiraIssue } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bug, FileText, Wand2, Paperclip, FileImage, File } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface JiraTicketPreviewDialogProps {
  issue: JiraIssue | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateTests: (issue: JiraIssue) => void;
}

export function JiraTicketPreviewDialog({ issue, isOpen, onClose, onGenerateTests }: JiraTicketPreviewDialogProps) {

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "outline";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('done') || lowerStatus.includes('resolved') || lowerStatus.includes('closed')) return 'default';
    if (lowerStatus.includes('in progress')) return 'secondary';
    if (lowerStatus.includes('to do') || lowerStatus.includes('open') || lowerStatus.includes('backlog')) return 'outline';
    return 'outline';
  };
  
  const getIssueTypeIcon = (issueType: string) => {
    if (!issueType) return <FileText className="h-4 w-4 text-muted-foreground" />;
    const lowerType = issueType.toLowerCase();
    if (lowerType.includes('bug')) {
        return <Bug className="h-4 w-4 text-destructive" />;
    }
    if (lowerType.includes('story')) {
        return <FileText className="h-4 w-4 text-green-500" />;
    }
    if (lowerType.includes('task')) {
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const getAttachmentIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
        return <FileImage className="h-4 w-4 text-muted-foreground" />;
    }
    return <File className="h-4 w-4 text-muted-foreground" />;
  }
  
  if (!issue) return null;

  const handleGenerateClick = () => {
    onGenerateTests(issue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl flex items-start gap-3">
             <span className="mt-1">{getIssueTypeIcon(issue.issueType)}</span>
             <div className="flex-grow">
                <span>{issue.key}: {issue.summary}</span>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getStatusBadgeVariant(issue.status)}>{issue.status}</Badge>
                    <Badge variant="outline">{issue.issueType}</Badge>
                </div>
             </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-grow px-6 py-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                {issue.description && (
                    <section>
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Description</h3>
                        <ReactMarkdown>{issue.description}</ReactMarkdown>
                    </section>
                )}

                {issue.acceptanceCriteria && (
                    <section className="mt-6">
                         <h3 className="text-lg font-semibold mb-2 border-b pb-1">Acceptance Criteria</h3>
                        <ReactMarkdown>{issue.acceptanceCriteria}</ReactMarkdown>
                    </section>
                )}
            </div>

            {issue.attachments && issue.attachments.length > 0 && (
                <section className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 border-b pb-1 flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        Attachments ({issue.attachments.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                        {issue.attachments.map(att => (
                            <a 
                                key={att.id} 
                                href={att.content} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group block border rounded-lg overflow-hidden text-center hover:bg-muted/50 transition-colors"
                            >
                                {att.thumbnail ? (
                                    <Image
                                        src={att.thumbnail}
                                        alt={att.filename}
                                        width={150}
                                        height={150}
                                        className="object-cover aspect-square w-full"
                                    />
                                ) : (
                                    <div className="h-32 flex items-center justify-center p-2">
                                        {getAttachmentIcon(att.mimeType)}
                                    </div>
                                )}
                                <p className="text-xs p-2 truncate text-muted-foreground group-hover:text-foreground">
                                    {att.filename}
                                </p>
                            </a>
                        ))}
                    </div>
                </section>
            )}
        </ScrollArea>

        <DialogFooter className="p-4 border-t bg-background/95 flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2">
            <DialogClose asChild>
                <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleGenerateClick}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Tests
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
