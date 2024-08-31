import CompactPullRequestItem from "@/components/PullRequestItem/Compact";
import NormalPullRequestItem from "@/components/PullRequestItem/Normal";
import SideNav from "@/components/SideNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LOCAL_STORAGE_KEY } from "@/constants";
import { PullRequest } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as _ from "lodash";
import {
  AArrowDown,
  ALargeSmall,
  ChevronDownIcon,
  InboxIcon,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const fetchPullRequests = async ({
  githubToken,
  owner,
  repositories,
}: {
  githubToken: string;
  owner: string;
  repositories: string[];
}) => {
  const res = await Promise.all(
    repositories.map((repository) =>
      axios.get(`https://api.github.com/repos/${owner}/${repository}/pulls`, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
    )
  );

  const allPullRequests = _.flatten(res.map((r) => r.data));
  return _.groupBy<PullRequest>(allPullRequests, "base.repo.name");
};

const FORM_PAYLOAD_LOCAL_STORAGE_KEY = "form-submit-payload";

export default function Home() {
  const { t } = useTranslation("common");
  const [repoName, setRepoName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const form = useForm({
    defaultValues: {
      githubToken: "",
      owner: "",
      repositories: [],
    },
  });
  const { getValues, handleSubmit, setValue } = form;

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "false") !== true
    ) {
      return;
    }
    const savedForm = localStorage.getItem(FORM_PAYLOAD_LOCAL_STORAGE_KEY);
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      setValue("githubToken", parsedForm.githubToken);
      setValue("owner", parsedForm.owner);
      setValue("repositories", parsedForm.repositories);
    }
  }, [setValue]);

  const {
    data: pullRequests,
    isLoading,
    error,
    refetch,
  } = useQuery<_.Dictionary<PullRequest[]>>({
    queryKey: [getValues()],
    queryFn: () => fetchPullRequests(getValues()),
    enabled: false,
  });
  const [viewMode, setViewMode] = useState<"compact" | "normal">("compact");

  const onSubmit = handleSubmit((data) => {
    if (
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "false") === true
    ) {
      localStorage.setItem(
        FORM_PAYLOAD_LOCAL_STORAGE_KEY,
        JSON.stringify(data)
      );
    }
    refetch();
  });

  if (error) {
    return <div>{t("errors.general", { message: error.message })}</div>;
  }

  const renderElem = () => {
    if (isLoading && !pullRequests) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    } else if (!pullRequests || Object.keys(pullRequests).length === 0) {
      return (
        <Card className="w-full">
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <InboxIcon className="w-12 h-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-600">
                {t("common.no_data")}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <div className="space-y-2 w-full">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) =>
              setViewMode(value as "compact" | "normal")
            }
            className="mb-4"
          >
            <ToggleGroupItem value="compact">
              <ALargeSmall className="w-4 h-4 mr-2" />
              {t("view_mode.compact")}
            </ToggleGroupItem>
            <ToggleGroupItem value="normal">
              <AArrowDown className="w-4 h-4 mr-2" />
              {t("view_mode.detailed")}
            </ToggleGroupItem>
          </ToggleGroup>
          <Collapsible className="w-full">
            {Object.entries(pullRequests || {}).map(([repo, prs]) => (
              <CollapsibleTrigger key={repo} className="w-full">
                <div className="flex justify-between items-center p-2 border-b">
                  <span>{repo}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
                <CollapsibleContent>
                  <ul className="space-y-2 p-2">
                    {prs.map((pr) => {
                      return viewMode === "compact" ? (
                        <CompactPullRequestItem key={pr.id} pr={pr} />
                      ) : (
                        <NormalPullRequestItem key={pr.id} pr={pr} />
                      );
                    })}
                  </ul>
                </CollapsibleContent>
              </CollapsibleTrigger>
            ))}
          </Collapsible>
        </div>
      );
    }
  };

  return (
    <div className="flex">
      <main className="flex-1">
        <div className="flex flex-col items-center my-4 gap-y-4 max-w-[1024px] mx-auto px-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t("pull_request.query_title")}</CardTitle>
              <CardDescription>
                {t("pull_request.query_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={onSubmit} className="mb-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="githubToken"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.github_token")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.enter_github_token")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="owner"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.owner")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.enter_owner_name")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repositories"
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.repository_name")}</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            <div className="flex space-x-2">
                              <Input
                                placeholder={t("form.enter_repository_name")}
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value)}
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  field.onChange([...field.value, repoName]);
                                  setRepoName("");
                                }}
                              >
                                {t("actions.add")}
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((repo, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="px-2 py-1"
                                >
                                  {repo}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 h-4 w-4 p-0"
                                    onClick={() =>
                                      field.onChange(
                                        field.value.filter(
                                          (_, i) => i !== index
                                        )
                                      )
                                    }
                                  >
                                    ×
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{t("actions.query")}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {renderElem()}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
