import {
  ProfileViewsResponse,
  LinkClicksResponse,
  SearchConversionsResponse,
  InviteConversionsResponse,
  DailyViewData,
  LinkClickItem,
} from "./analytics.type";

export interface NormalizedDailyView {
  date: string;
  day?: string;
  views: number;
}

export interface NormalizedLinkClick {
  id: string | number;
  title: string;
  url?: string;
  clicks: number;
  ctr: number; // 0..100 percentage
}

export interface NormalizedAnalyticsDashboard {
  viewsData: NormalizedDailyView[];
  totalViews: number;
  changePercentage: number;
  links: NormalizedLinkClick[];
  totalClicks: number;
  searchConversionRate: number; // 0..1 fraction
  inviteConversionRate: number; // 0..1 fraction
  keyInsight?: string;
}

export function normalizeProfileViews(
  raw?: ProfileViewsResponse | DailyViewData[] | null
): {
  viewsData: NormalizedDailyView[];
  totalViews: number;
  changePercentage: number;
  keyInsight?: string;
} {
  if (!raw) {
    return { viewsData: [], totalViews: 0, changePercentage: 0 };
  }

  let items: DailyViewData[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (Array.isArray(raw.data)) {
    items = raw.data;
  } else if (Array.isArray(raw.viewsByDate)) {
    items = raw.viewsByDate;
  } else if (Array.isArray(raw.views_by_date)) {
    items = raw.views_by_date;
  } else if (Array.isArray(raw.dailyViews)) {
    items = raw.dailyViews;
  } else if (Array.isArray(raw.daily_views)) {
    items = raw.daily_views;
  } else if (Array.isArray(raw.views)) {
    items = raw.views;
  }

  const viewsData: NormalizedDailyView[] = items.map((item, idx) => ({
    date: item.date || item.day || `point-${idx}`,
    day: item.day,
    views: item.views ?? item.count ?? item.total ?? 0,
  }));

  let totalViews = 0;
  if (typeof (raw as ProfileViewsResponse).totalViews === "number") {
    totalViews = (raw as ProfileViewsResponse).totalViews!;
  } else if (typeof (raw as ProfileViewsResponse).total_views === "number") {
    totalViews = (raw as ProfileViewsResponse).total_views!;
  } else if (
    (raw as ProfileViewsResponse).data &&
    typeof ((raw as ProfileViewsResponse).data as Record<string, unknown>)
      .total_views === "number"
  ) {
    totalViews = ((raw as ProfileViewsResponse).data as Record<string, unknown>)
      .total_views as number;
  } else {
    totalViews = viewsData.reduce((sum, d) => sum + d.views, 0);
  }

  let changePercentage = 0;
  const rawObj = raw as ProfileViewsResponse;
  if (typeof rawObj.changePercentage === "number") {
    changePercentage = rawObj.changePercentage;
  } else if (typeof rawObj.percentage_change === "number") {
    changePercentage = rawObj.percentage_change;
  } else if (typeof rawObj.viewsChangePercentage === "number") {
    changePercentage = rawObj.viewsChangePercentage;
  } else if (typeof rawObj.views_change_percentage === "number") {
    changePercentage = rawObj.views_change_percentage;
  } else if (
    rawObj.data &&
    typeof (rawObj.data as Record<string, unknown>).percentage_change ===
      "number"
  ) {
    changePercentage = (rawObj.data as Record<string, unknown>)
      .percentage_change as number;
  }

  const keyInsight = rawObj.keyInsight ?? rawObj.key_insight;

  return {
    viewsData,
    totalViews,
    changePercentage,
    keyInsight,
  };
}

export function normalizeLinkClicks(
  raw?: LinkClicksResponse | LinkClickItem[] | null
): {
  links: NormalizedLinkClick[];
  totalClicks: number;
} {
  if (!raw) {
    return { links: [], totalClicks: 0 };
  }

  let items: LinkClickItem[] = [];
  if (Array.isArray(raw)) {
    items = raw;
  } else if (Array.isArray(raw.data)) {
    items = raw.data;
  } else if (Array.isArray(raw.links)) {
    items = raw.links;
  } else if (Array.isArray(raw.items)) {
    items = raw.items;
  }

  const rawObj = raw as LinkClicksResponse;
  let totalClicks = 0;
  if (typeof rawObj.totalClicks === "number") {
    totalClicks = rawObj.totalClicks;
  } else if (typeof rawObj.total_clicks === "number") {
    totalClicks = rawObj.total_clicks;
  } else {
    totalClicks = items.reduce(
      (sum, l) => sum + (l.clicks ?? l.total_clicks ?? 0),
      0
    );
  }

  const links: NormalizedLinkClick[] = items.map((item, idx) => {
    const clicks = item.clicks ?? item.total_clicks ?? 0;
    const title =
      item.title || item.label || item.name || item.url || `Link ${idx + 1}`;

    let ctr = 0;
    if (item.ctr != null) {
      ctr = item.ctr <= 1 ? item.ctr * 100 : item.ctr;
    } else if (item.click_through_rate != null) {
      ctr =
        item.click_through_rate <= 1
          ? item.click_through_rate * 100
          : item.click_through_rate;
    } else if (item.conversion_rate != null) {
      ctr =
        item.conversion_rate <= 1
          ? item.conversion_rate * 100
          : item.conversion_rate;
    } else if (totalClicks > 0) {
      ctr = (clicks / totalClicks) * 100;
    }

    return {
      id: item.id ?? item.linkId ?? item.link_id ?? idx,
      title,
      url: item.url,
      clicks,
      ctr,
    };
  });

  return {
    links,
    totalClicks,
  };
}

export function normalizeSearchConversions(
  raw?: SearchConversionsResponse | null
): number {
  if (!raw) return 0;
  if (typeof raw.conversionRate === "number") {
    return raw.conversionRate > 1
      ? raw.conversionRate / 100
      : raw.conversionRate;
  }
  if (typeof raw.conversion_rate === "number") {
    return raw.conversion_rate > 1
      ? raw.conversion_rate / 100
      : raw.conversion_rate;
  }
  if (raw.data && typeof raw.data.conversion_rate === "number") {
    return raw.data.conversion_rate > 1
      ? raw.data.conversion_rate / 100
      : raw.data.conversion_rate;
  }

  const impressions = raw.searchImpressions ?? raw.search_impressions;
  const views =
    raw.profileViews ?? raw.profile_views ?? raw.profile_views_from_search;

  if (impressions && impressions > 0 && views != null) {
    return views / impressions;
  }

  return 0;
}

export function normalizeInviteConversions(
  raw?: InviteConversionsResponse | null
): number {
  if (!raw) return 0;
  if (typeof raw.conversion_rate === "number") {
    return raw.conversion_rate > 1
      ? raw.conversion_rate / 100
      : raw.conversion_rate;
  }
  if (typeof raw.conversionRate === "number") {
    return raw.conversionRate > 1
      ? raw.conversionRate / 100
      : raw.conversionRate;
  }
  if (raw.data && typeof raw.data.conversion_rate === "number") {
    return raw.data.conversion_rate > 1
      ? raw.data.conversion_rate / 100
      : raw.data.conversion_rate;
  }

  const sent = raw.invites_sent ?? raw.invitesSent;
  const claimed = raw.invites_claimed ?? raw.invitesClaimed;

  if (sent && sent > 0 && claimed != null) {
    return claimed / sent;
  }

  return 0;
}
