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
  const rawObj = raw as ProfileViewsResponse;
  const rawDataObj =
    rawObj.data && !Array.isArray(rawObj.data)
      ? (rawObj.data as Record<string, unknown>)
      : null;

  if (Array.isArray(raw)) {
    items = raw;
  } else if (Array.isArray(rawObj.data)) {
    items = rawObj.data;
  } else if (rawDataObj && Array.isArray(rawDataObj.daily_breakdown)) {
    items = rawDataObj.daily_breakdown as DailyViewData[];
  } else if (rawDataObj && Array.isArray(rawDataObj.dailyBreakdown)) {
    items = rawDataObj.dailyBreakdown as DailyViewData[];
  } else if (rawDataObj && Array.isArray(rawDataObj.views_by_date)) {
    items = rawDataObj.views_by_date as DailyViewData[];
  } else if (rawDataObj && Array.isArray(rawDataObj.daily_views)) {
    items = rawDataObj.daily_views as DailyViewData[];
  } else if (Array.isArray(rawObj.daily_breakdown)) {
    items = rawObj.daily_breakdown;
  } else if (Array.isArray(rawObj.dailyBreakdown)) {
    items = rawObj.dailyBreakdown;
  } else if (Array.isArray(rawObj.viewsByDate)) {
    items = rawObj.viewsByDate;
  } else if (Array.isArray(rawObj.views_by_date)) {
    items = rawObj.views_by_date;
  } else if (Array.isArray(rawObj.dailyViews)) {
    items = rawObj.dailyViews;
  } else if (Array.isArray(rawObj.daily_views)) {
    items = rawObj.daily_views;
  } else if (Array.isArray(rawObj.views)) {
    items = rawObj.views;
  }

  const viewsData: NormalizedDailyView[] = items.map((item, idx) => ({
    date: item.date || item.day || `point-${idx}`,
    day: item.day,
    views: item.views ?? item.count ?? item.total ?? 0,
  }));

  let totalViews = 0;
  if (typeof rawObj.totalViews === "number") {
    totalViews = rawObj.totalViews;
  } else if (typeof rawObj.total_views === "number") {
    totalViews = rawObj.total_views;
  } else if (typeof rawObj.range_total === "number") {
    totalViews = rawObj.range_total;
  } else if (typeof rawObj.rangeTotal === "number") {
    totalViews = rawObj.rangeTotal;
  } else if (typeof rawObj.total === "number") {
    totalViews = rawObj.total;
  } else if (rawDataObj) {
    if (typeof rawDataObj.range_total === "number") {
      totalViews = rawDataObj.range_total as number;
    } else if (typeof rawDataObj.rangeTotal === "number") {
      totalViews = rawDataObj.rangeTotal as number;
    } else if (typeof rawDataObj.total === "number") {
      totalViews = rawDataObj.total as number;
    } else if (typeof rawDataObj.total_views === "number") {
      totalViews = rawDataObj.total_views as number;
    } else if (typeof rawDataObj.totalViews === "number") {
      totalViews = rawDataObj.totalViews as number;
    } else {
      totalViews = viewsData.reduce((sum, d) => sum + d.views, 0);
    }
  } else {
    totalViews = viewsData.reduce((sum, d) => sum + d.views, 0);
  }

  let changePercentage = 0;
  if (typeof rawObj.changePercentage === "number") {
    changePercentage = rawObj.changePercentage;
  } else if (typeof rawObj.percentage_change === "number") {
    changePercentage = rawObj.percentage_change;
  } else if (typeof rawObj.viewsChangePercentage === "number") {
    changePercentage = rawObj.viewsChangePercentage;
  } else if (typeof rawObj.views_change_percentage === "number") {
    changePercentage = rawObj.views_change_percentage;
  } else if (rawDataObj) {
    if (typeof rawDataObj.percentage_change === "number") {
      changePercentage = rawDataObj.percentage_change as number;
    } else if (typeof rawDataObj.percentageChange === "number") {
      changePercentage = rawDataObj.percentageChange as number;
    } else if (typeof rawDataObj.change_percentage === "number") {
      changePercentage = rawDataObj.change_percentage as number;
    } else if (typeof rawDataObj.changePercentage === "number") {
      changePercentage = rawDataObj.changePercentage as number;
    }
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
  const rawData = raw.data;

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
  if (rawData && typeof rawData.conversion_rate === "number") {
    return rawData.conversion_rate > 1
      ? rawData.conversion_rate / 100
      : rawData.conversion_rate;
  }
  if (rawData && typeof rawData.conversionRate === "number") {
    return rawData.conversionRate > 1
      ? rawData.conversionRate / 100
      : rawData.conversionRate;
  }

  const impressions =
    raw.searches_surfaced ??
    raw.searchesSurfaced ??
    raw.searchImpressions ??
    raw.search_impressions ??
    rawData?.searches_surfaced ??
    rawData?.searchesSurfaced ??
    rawData?.search_impressions;

  const views =
    raw.search_driven_views ??
    raw.searchDrivenViews ??
    raw.profileViews ??
    raw.profile_views ??
    raw.profile_views_from_search ??
    rawData?.search_driven_views ??
    rawData?.searchDrivenViews ??
    rawData?.profile_views;

  if (impressions && impressions > 0 && views != null) {
    return views / impressions;
  }

  return 0;
}

export function normalizeInviteConversions(
  raw?: InviteConversionsResponse | null
): number {
  if (!raw) return 0;
  const rawData = raw.data;

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
  if (rawData && typeof rawData.conversion_rate === "number") {
    return rawData.conversion_rate > 1
      ? rawData.conversion_rate / 100
      : rawData.conversion_rate;
  }
  if (rawData && typeof rawData.conversionRate === "number") {
    return rawData.conversionRate > 1
      ? rawData.conversionRate / 100
      : rawData.conversionRate;
  }

  const sent =
    raw.invites_sent ??
    raw.invitesSent ??
    rawData?.invites_sent ??
    rawData?.invitesSent;

  const claimed =
    raw.invites_claimed ??
    raw.invitesClaimed ??
    rawData?.invites_claimed ??
    rawData?.invitesClaimed;

  if (sent && sent > 0 && claimed != null) {
    return claimed / sent;
  }

  return 0;
}
