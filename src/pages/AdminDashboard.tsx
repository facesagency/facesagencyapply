import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Search, Users, Filter, Eye, Download } from "lucide-react";
import facesLogo from "@/assets/faces-logo.png";

interface Application {
  id: string;
  created_at: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  date_of_birth: string | null;
  nationality: string | null;
  mobile: string | null;
  whatsapp: string | null;
  instagram: string | null;
  governorate: string | null;
  district: string | null;
  area: string | null;
  languages: unknown;
  eye_color: string | null;
  hair_color: string | null;
  height: string | null;
  weight: string | null;
  talents: unknown;
  sports: unknown;
  has_passport: boolean | null;
  willing_to_travel: boolean | null;
}

// Helper to safely convert JSONB to string array
const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

const AdminDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [governorateFilter, setGovernorateFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchQuery, governorateFilter, applications]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin-login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      navigate("/admin-login");
    }
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch applications.",
        variant: "destructive",
      });
    } else {
      setApplications(data || []);
    }
    setIsLoading(false);
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.first_name.toLowerCase().includes(query) ||
          app.last_name.toLowerCase().includes(query) ||
          app.mobile?.toLowerCase().includes(query) ||
          app.instagram?.toLowerCase().includes(query)
      );
    }

    if (governorateFilter !== "all") {
      filtered = filtered.filter((app) => app.governorate === governorateFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Date of Birth",
      "Nationality",
      "Mobile",
      "WhatsApp",
      "Instagram",
      "Governorate",
      "District",
      "Area",
      "Languages",
      "Height",
      "Weight",
      "Eye Color",
      "Hair Color",
      "Talents",
      "Sports",
      "Has Passport",
      "Willing to Travel",
      "Submitted At",
    ];

    const rows = filteredApplications.map((app) => [
      `${app.first_name} ${app.middle_name || ""} ${app.last_name}`.trim(),
      app.date_of_birth || "",
      app.nationality || "",
      app.mobile || "",
      app.whatsapp || "",
      app.instagram || "",
      app.governorate || "",
      app.district || "",
      app.area || "",
      toStringArray(app.languages).join(", "),
      app.height || "",
      app.weight || "",
      app.eye_color || "",
      app.hair_color || "",
      toStringArray(app.talents).join(", "),
      toStringArray(app.sports).join(", "),
      app.has_passport ? "Yes" : "No",
      app.willing_to_travel ? "Yes" : "No",
      new Date(app.created_at).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `applications_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const uniqueGovernorates = [...new Set(applications.map((app) => app.governorate).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={facesLogo} alt="Faces Agency" className="h-8" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{applications.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                With Passport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">
                {applications.filter((a) => a.has_passport).length}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Can Travel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">
                {applications.filter((a) => a.willing_to_travel).length}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or Instagram..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={governorateFilter} onValueChange={setGovernorateFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Governorate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Governorates</SelectItem>
                  {uniqueGovernorates.map((gov) => (
                    <SelectItem key={gov} value={gov!}>
                      {gov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No applications found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Physical</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="font-medium">
                            {app.first_name} {app.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {app.nationality}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{app.mobile}</div>
                          {app.instagram && (
                            <div className="text-sm text-muted-foreground">
                              @{app.instagram}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{app.governorate}</div>
                          <div className="text-sm text-muted-foreground">
                            {app.district}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {app.height} / {app.weight}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {app.eye_color} eyes
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {toStringArray(app.talents).slice(0, 2).map((talent) => (
                              <Badge key={talent} variant="secondary" className="text-xs">
                                {talent}
                              </Badge>
                            ))}
                            {toStringArray(app.talents).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{toStringArray(app.talents).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {app.has_passport && (
                              <Badge variant="default" className="text-xs w-fit">
                                Passport
                              </Badge>
                            )}
                            {app.willing_to_travel && (
                              <Badge variant="outline" className="text-xs w-fit">
                                Can Travel
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(app.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedApplication(app)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        {selectedApplication && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <Card
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle>
                  {selectedApplication.first_name} {selectedApplication.middle_name || ""}{" "}
                  {selectedApplication.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Info</h4>
                    <p className="text-sm">DOB: {selectedApplication.date_of_birth}</p>
                    <p className="text-sm">Nationality: {selectedApplication.nationality}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <p className="text-sm">Mobile: {selectedApplication.mobile}</p>
                    <p className="text-sm">WhatsApp: {selectedApplication.whatsapp}</p>
                    <p className="text-sm">Instagram: @{selectedApplication.instagram}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <p className="text-sm">
                      {selectedApplication.area}, {selectedApplication.district}
                    </p>
                    <p className="text-sm">{selectedApplication.governorate}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Physical</h4>
                    <p className="text-sm">Height: {selectedApplication.height}</p>
                    <p className="text-sm">Weight: {selectedApplication.weight}</p>
                    <p className="text-sm">Eyes: {selectedApplication.eye_color}</p>
                    <p className="text-sm">Hair: {selectedApplication.hair_color}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-1">
                      {toStringArray(selectedApplication.languages).map((lang) => (
                        <Badge key={lang} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Talents & Sports</h4>
                    <div className="flex flex-wrap gap-1">
                      {toStringArray(selectedApplication.talents).map((talent) => (
                        <Badge key={talent} variant="default">
                          {talent}
                        </Badge>
                      ))}
                      {toStringArray(selectedApplication.sports).map((sport) => (
                        <Badge key={sport} variant="outline">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setSelectedApplication(null)}>Close</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
