import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GroupMode, SortMode, ViewMode } from "@/types";
import {
  CalendarArrowDown,
  CalendarArrowUp,
  GroupIcon,
  Maximize,
  Minimize,
  UserIcon,
} from "lucide-react";
import { useTranslation } from "next-i18next";

function FilterPanel({
  groupMode,
  setGroupMode,
  setSortMode,
  setViewMode,
  sortMode,
  viewMode,
}: {
  groupMode: GroupMode;
  setGroupMode: (_value: GroupMode) => void;
  setSortMode: (_value: SortMode) => void;
  setViewMode: (_value: ViewMode) => void;
  sortMode: SortMode;
  viewMode: ViewMode;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-y-2 md:flex-row md:gap-x-2 md:items-center">
      <ToggleGroup
        type="single"
        value={groupMode}
        defaultValue={GroupMode.GROUP_BY_REPO}
        onValueChange={(value) => setGroupMode(value as GroupMode)}
        className="mb-4"
      >
        <ToggleGroupItem
          className="flex flex-row gap-x-2"
          value={GroupMode.GROUP_BY_REPO}
        >
          <GroupIcon className="w-4 h-4" />
          <span className="md:inline-block hidden">
            {t("group_mode.group_by_repo")}
          </span>
        </ToggleGroupItem>

        <ToggleGroupItem
          className="flex flex-row gap-x-2"
          value={GroupMode.GROUP_BY_AUTHOR}
        >
          <UserIcon className="w-4 h-4" />
          <span className="md:inline-block hidden">
            {t("group_mode.group_by_author")}
          </span>
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="md:hidden" />

      <ToggleGroup
        type="single"
        value={viewMode}
        defaultValue={ViewMode.COMPACT}
        onValueChange={(value) => setViewMode(value as ViewMode)}
        className="mb-4"
      >
        <ToggleGroupItem
          className="flex flex-row gap-x-2"
          value={ViewMode.COMPACT}
        >
          <Minimize className="w-4 h-4" />
          <span className="md:inline-block hidden">
            {t("view_mode.compact")}
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="flex flex-row gap-x-2"
          value={ViewMode.NORMAL}
        >
          <Maximize className="w-4 h-4" />
          <span className="md:inline-block hidden">
            {t("view_mode.detailed")}
          </span>
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="md:hidden" />

      <ToggleGroup
        type="single"
        value={sortMode}
        defaultValue={SortMode.CREATED_AT_ASC}
        onValueChange={(value) => setSortMode(value as SortMode)}
        className="mb-4"
      >
        <ToggleGroupItem
          className="flex flex-row gap-x-2"
          value={SortMode.CREATED_AT_ASC}
        >
          <CalendarArrowUp className="w-4 h-4" />
          <span className="md:inline-block hidden">
            {t("sort_mode.created_at_asc")}
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem
          className="flex flex-row gap-x-2"
          value={SortMode.CREATED_AT_DESC}
        >
          <CalendarArrowDown className="w-4 h-4" />
          <span className="md:inline-block hidden">
            {t("sort_mode.created_at_desc")}
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export default FilterPanel;
