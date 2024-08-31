import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GroupMode, SortMode, ViewMode } from "@/types";
import {
  AArrowDown,
  ALargeSmall,
  CalendarArrowDown,
  CalendarArrowUp,
  GroupIcon,
  UserIcon,
} from "lucide-react";
import { useTranslation } from "next-i18next";
import { isMobile } from "react-device-detect";

function FilterPanel({
  groupMode,
  setGroupMode,
  setSortMode,
  setViewMode,
  sortMode,
  viewMode,
}: {
  groupMode: GroupMode;
  setGroupMode: (value: GroupMode) => void;
  setSortMode: (value: SortMode) => void;
  setViewMode: (value: ViewMode) => void;
  sortMode: SortMode;
  viewMode: ViewMode;
}) {
  const { t } = useTranslation();
  return (
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
          {!isMobile && t("group_mode.group_by_repo")}
        </ToggleGroupItem>
        <ToggleGroupItem value={GroupMode.GROUP_BY_AUTHOR}>
          <UserIcon className="w-4 h-4 mr-2" />
          {!isMobile && t("group_mode.group_by_author")}
        </ToggleGroupItem>
      </ToggleGroup>

      {!isMobile && <Separator orientation="vertical" />}

      <ToggleGroup
        type="single"
        value={viewMode}
        defaultValue={ViewMode.COMPACT}
        onValueChange={(value) => setViewMode(value as ViewMode)}
        className="mb-4"
      >
        <ToggleGroupItem value={ViewMode.COMPACT}>
          <ALargeSmall className="w-4 h-4 mr-2" />
          {!isMobile && t("view_mode.compact")}
        </ToggleGroupItem>
        <ToggleGroupItem value={ViewMode.NORMAL}>
          <AArrowDown className="w-4 h-4 mr-2" />
          {!isMobile && t("view_mode.detailed")}
        </ToggleGroupItem>
      </ToggleGroup>

      {!isMobile && <Separator orientation="vertical" />}

      <ToggleGroup
        type="single"
        value={sortMode}
        defaultValue={SortMode.CREATED_AT_ASC}
        onValueChange={(value) => setSortMode(value as SortMode)}
        className="mb-4"
      >
        <ToggleGroupItem value={SortMode.CREATED_AT_ASC}>
          <CalendarArrowUp className="w-4 h-4 mr-2" />
          {!isMobile && t("sort_mode.created_at_asc")}
        </ToggleGroupItem>
        <ToggleGroupItem value={SortMode.CREATED_AT_DESC}>
          <CalendarArrowDown className="w-4 h-4 mr-2" />
          {!isMobile && t("sort_mode.created_at_desc")}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export default FilterPanel;
