
import { useState, useEffect } from "react";
import { User, Submission } from "@/types/user";
import { formatDate, calculateUserEngagement, calculateTimeToNextSubmission } from "@/utils/dateUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Activity, Clock, Filter, Download } from "lucide-react";

interface UserAnalyticsProps {
  users: User[];
  submissions: Submission[];
}

const UserAnalytics = ({ users, submissions }: UserAnalyticsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [sortColumn, setSortColumn] = useState<string>("engagementRate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Count submissions per user
  const submissionCounts = submissions.reduce((acc, submission) => {
    const userId = submission.userId;
    acc[userId] = (acc[userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate analytics for each user
  const usersWithAnalytics = users.map(user => {
    const userSubmissions = submissions.filter(s => s.userId === user.id);
    const submissionCount = userSubmissions.length;
    
    // Get last submission date
    const lastSubmissionDateObj = userSubmissions.length > 0 
      ? userSubmissions.reduce((latest, current) => {
          const currentDate = current.createdAt;
          if (!latest) return currentDate;
          if (!currentDate) return latest;
          
          const latestDate = latest instanceof Date ? latest : new Date(latest);
          const currDate = currentDate instanceof Date ? currentDate : new Date(currentDate);
          
          return currDate > latestDate ? currDate : latestDate;
        }, null as Date | string | null | undefined)
      : null;
    
    const engagement = calculateUserEngagement(
      user.registrationDate, 
      lastSubmissionDateObj || user.lastSubmissionDate, 
      submissionCount
    );
    
    const timeToNext = calculateTimeToNextSubmission(
      user.registrationDate,
      lastSubmissionDateObj || user.lastSubmissionDate,
      user.submissionTimeExtension
    );
    
    return {
      ...user,
      submissionCount,
      lastSubmissionDate: lastSubmissionDateObj || user.lastSubmissionDate,
      engagementRate: engagement.submissionsPerWeek,
      daysSinceLastSubmission: engagement.daysSinceLastSubmission,
      isActive: engagement.isActive,
      daysToNextSubmission: timeToNext.daysToNextSubmission,
      nextSubmissionDate: timeToNext.nextSubmissionDate,
      hasTimeExtension: timeToNext.hasTimeExtension
    };
  });

  useEffect(() => {
    // Apply search filter
    let filtered = [...usersWithAnalytics];
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) || 
        user.fullName?.toLowerCase().includes(query) || 
        user.studentNumber?.toLowerCase().includes(query) ||
        user.course?.toLowerCase().includes(query)
      );
    }
    
    // Sort users
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortColumn) {
        case "name":
          valueA = a.fullName || a.email || "";
          valueB = b.fullName || b.email || "";
          break;
        case "points":
          valueA = a.points || 0;
          valueB = b.points || 0;
          break;
        case "submissionCount":
          valueA = a.submissionCount;
          valueB = b.submissionCount;
          break;
        case "engagementRate":
          valueA = a.engagementRate;
          valueB = b.engagementRate;
          break;
        case "lastSubmission":
          valueA = a.lastSubmissionDate ? new Date(a.lastSubmissionDate).getTime() : 0;
          valueB = b.lastSubmissionDate ? new Date(b.lastSubmissionDate).getTime() : 0;
          break;
        case "nextSubmission":
          valueA = a.nextSubmissionDate ? a.daysToNextSubmission : Number.MAX_SAFE_INTEGER;
          valueB = b.nextSubmissionDate ? b.daysToNextSubmission : Number.MAX_SAFE_INTEGER;
          break;
        default:
          valueA = a.engagementRate;
          valueB = b.engagementRate;
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredUsers(filtered);
  }, [searchQuery, users, submissions, sortColumn, sortDirection, usersWithAnalytics]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const exportToCSV = () => {
    // Create CSV data
    const headers = [
      "Name", "Email", "Points", "Submissions", 
      "Engagement Rate", "Last Submission", 
      "Days to Next Submission", "Status"
    ];
    
    const rows = filteredUsers.map(user => [
      user.fullName || "N/A",
      user.email,
      user.points || 0,
      user.submissionCount,
      user.engagementRate,
      user.lastSubmissionDate ? formatDate(user.lastSubmissionDate) : "Never",
      user.daysToNextSubmission,
      user.isActive ? "Active" : "Inactive"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `user-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          User Engagement Analytics
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search users..." 
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("name")}
                  >
                    User
                    {sortColumn === "name" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right" 
                    onClick={() => handleSort("points")}
                  >
                    Points
                    {sortColumn === "points" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right" 
                    onClick={() => handleSort("submissionCount")}
                  >
                    Submissions
                    {sortColumn === "submissionCount" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right" 
                    onClick={() => handleSort("engagementRate")}
                  >
                    Engagement Rate
                    {sortColumn === "engagementRate" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("lastSubmission")}
                  >
                    Last Submission
                    {sortColumn === "lastSubmission" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("nextSubmission")}
                  >
                    Next Submission Due
                    {sortColumn === "nextSubmission" && (
                      <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.fullName || user.email}</p>
                          {user.fullName && <p className="text-sm text-gray-500">{user.email}</p>}
                          {user.course && <p className="text-xs text-gray-500">{user.course}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {user.points || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.submissionCount}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${
                          user.engagementRate > 1 ? "text-green-600" : 
                          user.engagementRate > 0.5 ? "text-blue-600" : "text-red-600"
                        }`}>
                          {user.engagementRate}/week
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.lastSubmissionDate ? (
                          <div className="flex flex-col">
                            <span>{formatDate(user.lastSubmissionDate)}</span>
                            <span className="text-xs text-gray-500">
                              {user.daysSinceLastSubmission} days ago
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.nextSubmissionDate ? (
                          <div className="flex flex-col">
                            <span>{formatDate(user.nextSubmissionDate)}</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs ${
                                user.daysToNextSubmission <= 1 ? "text-red-500" :
                                user.daysToNextSubmission <= 3 ? "text-orange-500" : "text-green-500"
                              }`}>
                                {user.daysToNextSubmission} days left
                              </span>
                              {user.hasTimeExtension && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  Extended
                                </Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Not available</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${
                          user.isActive 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAnalytics;
