import CompactPullRequestItem from "@/components/PullRequestItem/Compact";
import NormalPullRequestItem from "@/components/PullRequestItem/Normal";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LOCAL_STORAGE_KEY } from "@/constants";
import { PullRequest } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as _ from "lodash";
import {
  AArrowDown,
  ALargeSmall,
  CalendarArrowDown,
  CalendarArrowUp,
  ChevronDownIcon,
  GroupIcon,
  InboxIcon,
  UserIcon,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import HashLoader from "react-spinners/HashLoader";

enum GroupMode {
  GROUP_BY_REPO = "group_by_repo",
  GROUP_BY_AUTHOR = "group_by_author",
}

enum ViewMode {
  COMPACT = "compact",
  NORMAL = "normal",
}

enum SortMode {
  CREATED_AT_ASC = "created_at_asc",
  CREATED_AT_DESC = "created_at_desc",
}

const fetchPullRequests = async ({
  githubToken,
  owner,
  repositories,
}: {
  githubToken: string;
  owner: string;
  repositories: string[];
}) => {
  const res = await Promise.allSettled(
    repositories.map((repository) =>
      axios.get(`https://api.github.com/repos/${owner}/${repository}/pulls`, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
    )
  );

  const allPullRequests = _.flatten(
    res
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value.data)
  );

  return allPullRequests;
};

const FORM_PAYLOAD_LOCAL_STORAGE_KEY = "form-submit-payload";

export default function Home() {
  const { t } = useTranslation("common");
  const [repoName, setRepoName] = useState("");
  const form = useForm({
    defaultValues: {
      githubToken: "",
      owner: "",
      repositories: [],
    },
  });
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.COMPACT);
  const [groupMode, setGroupMode] = useState<GroupMode>(
    GroupMode.GROUP_BY_REPO
  );
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.CREATED_AT_ASC);
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
    data: allPullRequestList,
    isLoading,
    error,
    refetch,
  } = useQuery<PullRequest[]>({
    queryKey: [getValues()],
    queryFn: () =>
      fetchPullRequests({
        githubToken: getValues().githubToken,
        owner: getValues().owner,
        repositories: getValues().repositories,
      }),
    enabled: false,
  });

  const pullRequestList = useMemo(() => {
    const sortedPullRequestList = _.orderBy(
      allPullRequestList,
      "created_at",
      sortMode === SortMode.CREATED_AT_ASC ? "asc" : "desc"
    );

    return groupMode === GroupMode.GROUP_BY_REPO
      ? _.groupBy<PullRequest>(sortedPullRequestList, "base.repo.name")
      : _.groupBy<PullRequest>(sortedPullRequestList, "user.login");
  }, [allPullRequestList, groupMode, sortMode]);

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
    if (isLoading && !allPullRequestList) {
      return (
        <Card className="w-full">
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <HashLoader
                color="#000"
                size={40}
                className="flex justify-center items-center"
              />
            </div>
          </CardContent>
        </Card>
      );
    } else if (
      !allPullRequestList ||
      Object.keys(allPullRequestList).length === 0
    ) {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {groupMode === GroupMode.GROUP_BY_REPO
                    ? t("common.repository")
                    : t("common.author")}
                </TableHead>
                <TableHead>{t("common.content")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(pullRequestList || {}).map(([repo, prs]) => (
                <TableRow key={repo}>
                  <TableCell>{repo}</TableCell>
                  <TableCell>
                    <ul className="space-y-2">
                      {prs.map((pr) =>
                        viewMode === ViewMode.COMPACT ? (
                          <CompactPullRequestItem key={pr.id} pr={pr} />
                        ) : (
                          <NormalPullRequestItem key={pr.id} pr={pr} />
                        )
                      )}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

          <div className="flex flex-row gap-x-2">
            <ToggleGroup
              type="single"
              value={groupMode}
              defaultValue={GroupMode.GROUP_BY_REPO}
              onValueChange={(value) => setGroupMode(value as GroupMode)}
              className="mb-4"
            >
              <ToggleGroupItem value={GroupMode.GROUP_BY_REPO}>
                <GroupIcon className="w-4 h-4 mr-2" />
                {t("group_mode.group_by_repo")}
              </ToggleGroupItem>
              <ToggleGroupItem value={GroupMode.GROUP_BY_AUTHOR}>
                <UserIcon className="w-4 h-4 mr-2" />
                {t("group_mode.group_by_author")}
              </ToggleGroupItem>
            </ToggleGroup>

            <Separator orientation="vertical" />

            <ToggleGroup
              type="single"
              value={viewMode}
              defaultValue={ViewMode.COMPACT}
              onValueChange={(value) => setViewMode(value as ViewMode)}
              className="mb-4"
            >
              <ToggleGroupItem value={ViewMode.COMPACT}>
                <ALargeSmall className="w-4 h-4 mr-2" />
                {t("view_mode.compact")}
              </ToggleGroupItem>
              <ToggleGroupItem value={ViewMode.NORMAL}>
                <AArrowDown className="w-4 h-4 mr-2" />
                {t("view_mode.detailed")}
              </ToggleGroupItem>
            </ToggleGroup>

            <Separator orientation="vertical" />

            <ToggleGroup
              type="single"
              value={sortMode}
              defaultValue={SortMode.CREATED_AT_ASC}
              onValueChange={(value) => setSortMode(value as SortMode)}
              className="mb-4"
            >
              <ToggleGroupItem value={SortMode.CREATED_AT_ASC}>
                <CalendarArrowUp className="w-4 h-4 mr-2" />
                {t("sort_mode.created_at_asc")}
              </ToggleGroupItem>
              <ToggleGroupItem value={SortMode.CREATED_AT_DESC}>
                <CalendarArrowDown className="w-4 h-4 mr-2" />
                {t("sort_mode.created_at_desc")}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

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
