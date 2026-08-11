export interface AnalyticsDateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface DailyViewData {
  date: string;
  day?: string;
  count?: number;
  views?: number;
  total?: number;
}

export interface ProfileViewsResponse {
  totalViews?: number;
  total_views?: number;
  total?: number;
  rangeTotal?: number;
  range_total?: number;
  uniqueViewers?: number;
  unique_viewers?: number;
  previousPeriodViews?: number;
  previous_period_views?: number;
  changePercentage?: number;
  percentage_change?: number;
  viewsChangePercentage?: number;
  views_change_percentage?: number;
  viewsByDate?: DailyViewData[];
  views_by_date?: DailyViewData[];
  dailyViews?: DailyViewData[];
  daily_views?: DailyViewData[];
  dailyBreakdown?: DailyViewData[];
  daily_breakdown?: DailyViewData[];
  views?: DailyViewData[];
  data?:
    | DailyViewData[]
    | {
        total?: number;
        range_total?: number;
        rangeTotal?: number;
        unique_viewers?: number;
        uniqueViewers?: number;
        total_views?: number;
        totalViews?: number;
        views_by_date?: DailyViewData[];
        daily_breakdown?: DailyViewData[];
        dailyBreakdown?: DailyViewData[];
        daily_views?: DailyViewData[];
        percentage_change?: number;
        percentageChange?: number;
        change_percentage?: number;
        changePercentage?: number;
      };
  keyInsight?: string;
  key_insight?: string;
}

export interface LinkClickItem {
  id?: string | number;
  linkId?: string | number;
  link_id?: string | number;
  title?: string;
  label?: string;
  name?: string;
  url?: string;
  clicks?: number;
  total_clicks?: number;
  ctr?: number;
  click_through_rate?: number;
  percentage?: number;
  conversion_rate?: number;
}

export interface LinkClicksResponse {
  totalClicks?: number;
  total_clicks?: number;
  links?: LinkClickItem[];
  items?: LinkClickItem[];
  data?:
    | LinkClickItem[]
    | {
        total_clicks?: number;
        links?: LinkClickItem[];
      };
}

export interface SearchConversionsResponse {
  conversionRate?: number;
  conversion_rate?: number;
  searchImpressions?: number;
  search_impressions?: number;
  searches_surfaced?: number;
  searchesSurfaced?: number;
  profileViews?: number;
  profile_views?: number;
  profile_views_from_search?: number;
  search_driven_views?: number;
  searchDrivenViews?: number;
  data?: {
    conversion_rate?: number;
    conversionRate?: number;
    search_impressions?: number;
    searches_surfaced?: number;
    searchesSurfaced?: number;
    profile_views?: number;
    profile_views_from_search?: number;
    search_driven_views?: number;
    searchDrivenViews?: number;
  };
}

export interface InviteConversionsResponse {
  invites_sent?: number;
  invites_claimed?: number;
  conversion_rate?: number;
  invitesSent?: number;
  invitesClaimed?: number;
  conversionRate?: number;
  data?: {
    invites_sent?: number;
    invites_claimed?: number;
    conversion_rate?: number;
    invitesSent?: number;
    invitesClaimed?: number;
    conversionRate?: number;
  };
}
