import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PullRequest } from "@/types";
import { GitBranchIcon, GitPullRequestIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const NormalPullRequestItem: React.FC<{ pr: PullRequest }> = ({ pr }) => {
  const { t } = useTranslation();
  return (
    <li key={pr.id} className="py-2">
      <Card className="hover:bg-accent transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GitPullRequestIcon className="w-5 h-5" />
              <a
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {pr.title}
              </a>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={pr.user.avatar_url}
                        alt={pr.user.login}
                      />
                      <AvatarFallback>{pr.user.login[0]}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{pr.user.login}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex flex-col text-left">
                <div className="font-medium">{pr.user.login}</div>
                <div className="text-sm text-muted-foreground">
                  {t("pull_request.created_at", {
                    date: new Date(pr.created_at).toLocaleString("zh-TW"),
                  })}
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitBranchIcon className="w-4 h-4" />
              <span>
                {pr.base.ref} ← {pr.head.ref}
              </span>
            </div>
          </div>
          <ScrollArea className="h-auto">
            <ReactMarkdown
              components={{
                a: ({ ...props }) => (
                  <a
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                code: ({ ...props }) => (
                  <code
                    className="bg-gray-100 rounded px-1 py-0.5"
                    {...props}
                  />
                ),
                h1: ({ ...props }) => (
                  <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="text-xl font-semibold mt-3 mb-2" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="text-lg font-medium mt-2 mb-1" {...props} />
                ),
                p: ({ ...props }) => <p className="mb-2" {...props} />,
                ul: ({ ...props }) => (
                  <ul className="list-disc list-inside mb-2" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal list-inside mb-2" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-gray-300 pl-4 italic"
                    {...props}
                  />
                ),
              }}
              className="text-sm text-muted-foreground text-left"
            >
              {pr.body}
            </ReactMarkdown>
          </ScrollArea>
          <div className="flex flex-wrap gap-2">
            {pr.labels.map((label) => (
              <TooltipProvider key={label.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: `#${label.color}`,
                        color: `#${label.color}`,
                      }}
                    >
                      {label.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{label.description}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() =>
                window.open(pr.html_url, "_blank", "noopener,noreferrer")
              }
            >
              {t("actions.open_pr_in_new_tab")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </li>
  );
};

export default NormalPullRequestItem;
