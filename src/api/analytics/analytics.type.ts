export interface AnalyticsDateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface DailyViewData {
  date: string;
  day?: string;
  count?: number;
  views?: number;
}

export interface ProfileViewsResponse {
  totalViews?: number;
  total_views?: number;
  previousPeriodViews?: number;
  previous_period_views?: number;
  changePercentage?: number;
  percentage_change?: number;
  viewsByDate?: DailyViewData[];
  views_by_date?: DailyViewData[];
  dailyViews?: DailyViewData[];
  views?: DailyViewData[];
  keyInsight?: string;
  key_insight?: string;
}

export interface LinkClickItem {
  id?: string;
  linkId?: string;
  link_id?: string;
  title: string;
  url?: string;
  clicks: number;
  ctr?: number;
  percentage?: number;
}

export interface LinkClicksResponse {
  totalClicks?: number;
  total_clicks?: number;
  links?: LinkClickItem[];
  items?: LinkClickItem[];
}

export interface SearchConversionsResponse {
  conversionRate?: number;
  conversion_rate?: number;
  searchImpressions?: number;
  search_impressions?: number;
  profileViews?: number;
  profile_views?: number;
}

export interface InviteConversionsResponse {
  invites_sent: number;
  invites_claimed: number;
  conversion_rate: number;
  invitesSent?: number;
  invitesClaimed?: number;
  conversionRate?: number;
}
