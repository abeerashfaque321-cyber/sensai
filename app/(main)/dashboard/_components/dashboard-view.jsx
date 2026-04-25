"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
  // 1. Safe Check: Agar data fetch nahi hua toh loading state dikhao
  if (!insights) {
    return <div className="p-10 text-center text-muted-foreground">Loading industry insights...</div>;
  }

  // 2. Transform salary data with fallback for empty arrays
  const salaryData = (insights.salaryRanges || []).map((range) => ({
    name: range.role || "N/A",
    min: (range.min || 0) / 1000,
    max: (range.max || 0) / 1000,
    median: (range.median || 0) / 1000,
  }));

  const getDemandLevelColor = (level = "") => {
    switch (level.toLowerCase()) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook = "") => {
    switch (outlook.toLowerCase()) {
      case "positive": return { icon: TrendingUp, color: "text-green-500" };
      case "neutral": return { icon: LineChart, color: "text-yellow-500" };
      case "negative": return { icon: TrendingDown, color: "text-red-500" };
      default: return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(insights.marketOutlook);

  // Date formatting with safety
  const lastUpdatedDate = insights.lastUpdated ? format(new Date(insights.lastUpdated), "dd/MM/yyyy") : "N/A";
  const nextUpdateDistance = insights.nextUpdate ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true }) : "Coming soon";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold uppercase">{insights.marketOutlook || "NEUTRAL"}</div>
            <p className="text-xs text-muted-foreground">Next update {nextUpdateDistance}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(insights.growthRate || 0).toFixed(1)}%</div>
            <Progress value={insights.growthRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel || "N/A"}</div>
            <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {(insights.topSkills || []).length > 0 ? (
                insights.topSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No skills listed</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>Minimum, median, and maximum salaries (in thousands)</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Fixed height container for Recharts */}
          <div style={{ width: '100%', height: 400 }}>
            {salaryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border rounded-lg p-2 shadow-md">
                            <p className="font-medium text-popover-foreground">{label}</p>
                            {payload.map((item) => (
                              <p key={item.name} className="text-sm text-muted-foreground">
                                {item.name}: ${item.value}K
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="min" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Min Salary" />
                  <Bar dataKey="median" fill="#64748b" radius={[4, 4, 0, 0]} name="Median Salary" />
                  <Bar dataKey="max" fill="#475569" radius={[4, 4, 0, 0]} name="Max Salary" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
                Please add salary data in database to view chart
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends & Recommended Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {(insights.keyTrends || []).map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span className="text-sm">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(insights.recommendedSkills || []).map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;