import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PullRequest } from "@/types";
import { useTranslation } from "react-i18next";

const CompactPullRequestItem: React.FC<{ pr: PullRequest }> = ({ pr }) => {
  const { t } = useTranslation();
  return <li key={pr.id} className="py-1">
    <Card className="hover:bg-accent transition-colors">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={pr.user.avatar_url} alt={pr.user.login} />
                    <AvatarFallback>{pr.user.login[0]}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{pr.user.login}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div>
              <a
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline line-clamp-1"
              >
                {pr.title}
              </a>
              <div className="text-xs text-muted-foreground">
                {new Date(pr.created_at).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-1 overflow-hidden">
              {pr.labels.slice(0, 3).map((label) => (
                <TooltipProvider key={label.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        variant="default"
                        className="w-6 h-6 rounded-full border-2"
                        style={{
                          borderColor: `#${label.color}`,
                          backgroundColor: `#${label.color}`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>{label.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {pr.labels.length > 3 && (
                <Badge
                  variant="secondary"
                  className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground"
                >
                  +{pr.labels.length - 3}
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="px-2 h-8"
              onClick={() =>
                window.open(pr.html_url, "_blank", "noopener,noreferrer")
              }
            >
              {t("actions.open_pr_in_new_tab")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </li>;
};

export default CompactPullRequestItem;
