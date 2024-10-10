import CompactPullRequestItem from "@/components/PullRequestItem/Compact";
import NormalPullRequestItem from "@/components/PullRequestItem/Normal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LOCAL_STORAGE_KEY } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { GroupMode, PullRequest, SortMode, ViewMode } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as _ from "lodash";
import { CopyIcon, InboxIcon, XIcon } from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import HashLoader from "react-spinners/HashLoader";
import FilterPanel from "@/components/FilterPanel";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import Fuse from "fuse.js";

const fetchPullRequests = async ({
  githubToken,
  owner,
  repositories,
  excludeOwnPRs,
}: {
  githubToken: string;
  owner: string;
  repositories: string[];
  excludeOwnPRs: boolean;
}) => {
  const userResponse = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  const currentUser = userResponse.data.login;

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

  return excludeOwnPRs
    ? allPullRequests.filter((pr) => pr.user.login !== currentUser)
    : allPullRequests;
};

const FORM_PAYLOAD_LOCAL_STORAGE_KEY = "form-submit-payload";

export default function Home() {
  const router = useRouter();
  const { githubToken, owner, repositories, excludeOwnPRs } = router.query;
  const { t } = useTranslation("common");
  const [repoName, setRepoName] = useState("");
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const form = useForm<{
    githubToken: string;
    owner: string;
    repositories: string[];
    excludeOwnPRs: boolean;
  }>({
    defaultValues: {
      githubToken: "",
      owner: "",
      repositories: [],
      excludeOwnPRs: false,
    },
  });
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.COMPACT);
  const [groupMode, setGroupMode] = useState<GroupMode>(
    GroupMode.GROUP_BY_REPO
  );
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.CREATED_AT_ASC);
  const { getValues, handleSubmit, setValue, reset } = form;

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "false") === true
    ) {
      const savedForm = localStorage.getItem(FORM_PAYLOAD_LOCAL_STORAGE_KEY);

      if (savedForm) {
        reset(JSON.parse(savedForm));
      }
    }

    if (Object.keys(router.query).length <= 0) {
      return;
    }

    const repositoriesArray = Array.isArray(repositories)
      ? repositories
      : ((repositories as string) || "").split(",");

    const validRepositories = repositoriesArray.filter((repo) => repo !== "");

    reset({
      githubToken: (githubToken as string) || "",
      owner: (owner as string) || "",
      repositories: validRepositories,
      excludeOwnPRs: (excludeOwnPRs as string) === "true",
    });
  }, [
    setValue,
    router.query,
    reset,
    repositories,
    githubToken,
    owner,
    excludeOwnPRs,
  ]);

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
        excludeOwnPRs: getValues().excludeOwnPRs,
      }),
    enabled: false,
    retry: false,
  });

  const pullRequestList = useMemo(() => {
    if (!allPullRequestList) return {};

    const sortedPullRequestList = _.orderBy(
      allPullRequestList,
      "created_at",
      sortMode === SortMode.CREATED_AT_ASC ? "asc" : "desc"
    );

    const fuse = new Fuse(sortedPullRequestList, {
      keys: ["title", "base.repo.name", "body", "user.login"],
      threshold: 0.3,
    });

    const filteredPullRequestList = keyword
      ? fuse.search(keyword).map((result) => result.item)
      : sortedPullRequestList;

    return groupMode === GroupMode.GROUP_BY_REPO
      ? _.groupBy<PullRequest>(filteredPullRequestList, "base.repo.name")
      : _.groupBy<PullRequest>(filteredPullRequestList, "user.login");
  }, [allPullRequestList, groupMode, sortMode, keyword]);

  const onSubmit = handleSubmit((data) => {
    const queryParams = new URLSearchParams({
      githubToken: data.githubToken,
      owner: data.owner,
      repositories: data.repositories.join(","),
      excludeOwnPRs: data.excludeOwnPRs.toString(),
    });
    router.replace(`/?${queryParams.toString()}`);
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

  useEffect(() => {
    if (error) {
      const _error = error as AxiosError<{ message: string }>;
      toast(
        {
          variant: "destructive",
          title: t("errors.general.status_code", {
            statusCode: _error.response?.status,
          }),
          description: t("errors.general.description", {
            description: _error.response?.data?.message,
          }),
        },
        {
          duration: 5000,
        }
      );
    }
  }, [error, t, toast]);

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
        <div className="overflow-x-auto w-full max-w-[1024px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {groupMode === GroupMode.GROUP_BY_REPO
                    ? t("common.repository")
                    : t("common.author")}
                </TableHead>
                <TableHead className="w-7/8">{t("common.content")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(pullRequestList || {}).map(([name, prs]) => (
                <TableRow key={name}>
                  <TableCell className="w-40 break-before-all min-w-28">
                    {name}
                  </TableCell>
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

  const isShowCopyUrlButton =
    getValues().githubToken &&
    getValues().owner &&
    getValues().repositories.length > 0;

  return (
    <div className="flex flex-col lg:flex-row">
      <main className="flex-1">
        <div className="flex flex-col items-center my-4 gap-y-4 px-2 sm:px-4">
          <Card className="w-full">
            <CardHeader className="flex flex-col lg:flex-row justify-between">
              <div className="px-2 flex-col gap-y-2 flex">
                <CardTitle>{t("pull_request.query_title")}</CardTitle>
                <CardDescription>
                  <Link
                    target="_blank"
                    href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic"
                    className="text-blue-500 underline"
                  >
                    {t("pull_request.how_to_get_token_link")}
                  </Link>
                </CardDescription>
                <CardDescription>
                  {t("pull_request.query_description")}
                </CardDescription>
              </div>
              {isShowCopyUrlButton && (
                <Button
                  className="flex flex-row gap-x-2 mt-4 lg:mt-0"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    toast(
                      {
                        variant: "default",
                        title: t("form.copied_url"),
                        description: t("form.copied_url_description"),
                      },
                      {
                        duration: 5000,
                      }
                    );
                  }}
                >
                  <CopyIcon className="w-4 h-4" />
                  <span className="hidden md:block">
                    {t("actions.copy_url")}
                  </span>
                </Button>
              )}
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
                  <FormField
                    control={form.control}
                    name="excludeOwnPRs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{t("form.exclude_own_prs")}</FormLabel>
                          <FormDescription>
                            {t("form.exclude_own_prs_description")}
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{t("actions.query")}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t("form.keyword_search_label")}</CardTitle>
              <CardDescription>
                {t("form.keyword_search_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  id="keyword-search"
                  placeholder={t("form.enter_keyword")}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pr-12 pl-4 py-3 text-base rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label={t("form.keyword_search_aria_label")}
                />
                {keyword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
                    onClick={() => setKeyword("")}
                    aria-label={t("form.clear_keyword_search")}
                  >
                    <XIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-start">
              <FilterPanel
                groupMode={groupMode}
                setGroupMode={setGroupMode}
                setSortMode={setSortMode}
                setViewMode={setViewMode}
                sortMode={sortMode}
                viewMode={viewMode}
              />
            </CardFooter>
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
