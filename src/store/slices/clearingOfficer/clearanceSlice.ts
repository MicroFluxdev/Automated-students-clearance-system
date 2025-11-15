import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  yearLevel: string;
  semester: string;
  requirements: string[];
  department: string;
  dueDate: string;
  description: string;
  completed: boolean;
  students: number;
}

interface ClearanceState {
  search: string;
  selectedCategory: string;
  isDialogOpen: boolean;
  newRequirement: {
    courseCode: string;
    courseName: string;
    yearLevel: string;
    semester: string;
    requirements: string[];
    department: string;
    dueDate: string;
    description: string;
  };
  confirmDialog: {
    isOpen: boolean;
    type: "single" | "multiple" | null;
    studentName?: string;
    onConfirm?: (() => void) | null;
  };

  requirements: Course[];
}

const initialRequirements: Course[] = [
  {
    id: 1,
    courseCode: "CC107",
    courseName: "Data Structures and Algorithms",
    yearLevel: "2nd Year",
    semester: "1st Semester",
    requirements: ["CC107"],
    department: "BS-Computer Science",
    dueDate: "May 15, 2025",
    description: "Advanced topics in data structures and algorithms.",
    completed: true,
    students: 45,
  },
  {
    id: 2,
    courseCode: "SE102",
    courseName: "Software Design and Architecture",
    yearLevel: "2nd Year",
    semester: "1st Semester",
    requirements: ["SE102", "SE103", "SE104"],
    department: "BS-Education",
    dueDate: "April 28, 2025",
    description: "Principles of software design and architecture.",
    completed: false,
    students: 38,
  },
  {
    id: 3,
    courseCode: "IS301",
    courseName: "Database Management Systems",
    yearLevel: "3rd Year",
    semester: "1st Semester",
    requirements: ["IS301", "IS302"],
    department: "BS-Administration",
    dueDate: "June 5, 2025",
    description: "In-depth study of database management systems.",
    completed: false,
    students: 52,
  },
  {
    id: 4,
    courseCode: "CS404",
    courseName: "Artificial Intelligence and Machine Learning",
    yearLevel: "4th Year",
    semester: "2nd Semester",
    requirements: ["CS404", "CS405", "CS406"],
    department: "BS-Accounting",
    dueDate: "May 20, 2025",
    description: "Exploring the fundamentals of AI and machine learning.",
    completed: true,
    students: 30,
  },
];

const initialState: ClearanceState = {
  search: "",
  selectedCategory: "all",
  isDialogOpen: false,
  newRequirement: {
    courseCode: "",
    courseName: "",
    yearLevel: "",
    semester: "",
    requirements: [],
    department: "",
    dueDate: "",
    description: "",
  },
  confirmDialog: {
    isOpen: false,
    type: null,
    studentName: undefined,
    onConfirm: null,
  },
  requirements: initialRequirements,
};

const clearanceSlice = createSlice({
  name: "clearance",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setIsDialogOpen(state, action: PayloadAction<boolean>) {
      state.isDialogOpen = action.payload;
    },
    setNewRequirement(
      state,
      action: PayloadAction<ClearanceState["newRequirement"]>
    ) {
      state.newRequirement = action.payload;
    },
    addRequirement(state, action: PayloadAction<Course>) {
      state.requirements.push(action.payload);
      state.newRequirement = initialState.newRequirement; // reset form
      state.isDialogOpen = false;
    },
    setConfirmDialog(
      state,
      action: PayloadAction<Partial<ClearanceState["confirmDialog"]>>
    ) {
      // Redux Toolkit’s serializableCheck may warn about storing functions.
      // To suppress, ensure the store config disables serializableCheck or store only an identifier.
      state.confirmDialog = { ...state.confirmDialog, ...action.payload };
    },
  },
});

export const {
  setSearch,
  setSelectedCategory,
  setIsDialogOpen,
  setNewRequirement,
  addRequirement,
  setConfirmDialog,
} = clearanceSlice.actions;
export default clearanceSlice.reducer;
