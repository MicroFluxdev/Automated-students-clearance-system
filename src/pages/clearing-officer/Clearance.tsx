import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Users,
  Calendar,
  ClipboardList,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Course {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  students: number;
  department: string;
}

const requirements: Course[] = [
  {
    title: "CC107 - Data Structures",
    description: "Advanced topics in data structures and algorithms.",
    dueDate: "May 15, 2025",
    completed: true,
    students: 45,
    department: "Computer Science",
  },
  {
    title: "SE102 - Software Design",
    description: "Principles of software design and architecture.",
    dueDate: "April 28, 2025",
    completed: false,
    students: 38,
    department: "Software Engineering",
  },
  {
    title: "IS301 - Database Systems",
    description: "In-depth study of database management systems.",
    dueDate: "June 5, 2025",
    completed: false,
    students: 52,
    department: "Information Systems",
  },
  {
    title: "CS404 - Artificial Intelligence",
    description: "Exploring the fundamentals of AI and machine learning.",
    dueDate: "May 20, 2025",
    completed: true,
    students: 30,
    department: "Computer Science",
  },
];

const Clearance = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newRequirement, setNewRequirement] = useState({
    title: "",
    description: "",
    dueDate: "",
    department: "",
  });

  const categories = [
    "all",
    "Computer Science",
    "Software Engineering",
    "Information Systems",
  ];

  const filteredRequirements = requirements.filter(
    (req) =>
      (req.title.toLowerCase().includes(search.toLowerCase()) ||
        req.description.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === "all" || req.department === selectedCategory)
  );

  const handleCreateRequirement = () => {
    // Handle form submission logic here
    console.log("Creating requirement:", newRequirement);
    setIsDialogOpen(false);
    // Reset form
    setNewRequirement({
      title: "",
      description: "",
      dueDate: "",
      department: "",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Clearance</h1>
              <p className="text-gray-500 mt-1">
                Manage and track all available requirements.
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Requirements
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Requirement</DialogTitle>
                <DialogDescription>
                  Add a new clearance requirement for students to complete.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter requirement title"
                    value={newRequirement.title}
                    onChange={(e) =>
                      setNewRequirement({
                        ...newRequirement,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newRequirement.department}
                    onValueChange={(value) =>
                      setNewRequirement({
                        ...newRequirement,
                        department: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter requirement description"
                    value={newRequirement.description}
                    onChange={(e) =>
                      setNewRequirement({
                        ...newRequirement,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newRequirement.dueDate}
                    onChange={(e) =>
                      setNewRequirement({
                        ...newRequirement,
                        dueDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleCreateRequirement}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Requirement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <Card className="flex flex-col sm:flex-row items-center gap-4 px-5">
          <div className="relative flex-1 w-full sm:w-auto ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full  md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {filteredRequirements.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              No Requirements Found
            </h2>
            <p className="mt-2 text-gray-500">
              Adjust your search or filter to find what you are looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            {filteredRequirements.map((req, index) => (
              <Card
                key={index}
                className="flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <ClipboardList className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-700">
                          {req.title}
                        </CardTitle>
                        <CardDescription>{req.department}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={req.completed ? "default" : "secondary"}
                      className={
                        req.completed ? "bg-green-500" : "bg-yellow-500"
                      }
                    >
                      {req.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-600 text-sm mb-4">
                    {req.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Due: {req.dueDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{req.students} students enrolled</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    to="/clearing-officer/student-records"
                    className="w-full"
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Records
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clearance;
