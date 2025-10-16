import React, { useState } from "react";
import {
  Card,
  Button,
  Input,
  Table,
  Modal,
  Select,
  Space,
  Form,
  message,
  Tag,
  Badge,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  BookOutlined,
  EditOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { type ColumnsType } from "antd/es/table";
import {
  enrollmentDummyData,
  generateCourse,
} from "@/data/enrollmentDummyData";
import type { Course, Section } from "@/types/enrollment";

const { Option } = Select;
const { TextArea } = Input;

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(enrollmentDummyData.courses);
  const [sections, setSections] = useState<Section[]>(
    enrollmentDummyData.sections
  );
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    status: "",
  });
  const [activeTab, setActiveTab] = useState<"courses" | "sections">("courses");
  const [courseForm] = Form.useForm();
  const [sectionForm] = Form.useForm();

  const departments = [
    "Computer Science",
    "Information Technology",
    "Computer Engineering",
    "Information Systems",
    "Software Engineering",
  ];

  const semesters = enrollmentDummyData.semesters;
  const statuses = ["Active", "Inactive"];

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      !searchText ||
      course.courseCode.toLowerCase().includes(searchText.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchText.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchesFilters =
      (!filters.department || course.department === filters.department) &&
      (!filters.status || course.status === filters.status);

    return matchesSearch && matchesFilters;
  });

  // Filter sections based on search and filters
  const filteredSections = sections.filter((section) => {
    const matchesSearch =
      !searchText ||
      section.sectionCode.toLowerCase().includes(searchText.toLowerCase()) ||
      section.sectionName.toLowerCase().includes(searchText.toLowerCase()) ||
      section.course.courseName
        .toLowerCase()
        .includes(searchText.toLowerCase());

    const matchesFilters =
      (!filters.department ||
        section.course.department === filters.department) &&
      (!filters.status || section.status === filters.status);

    return matchesSearch && matchesFilters;
  });

  const handleAddCourse = () => {
    setEditingCourse(null);
    courseForm.resetFields();
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    courseForm.setFieldsValue({
      ...course,
      prerequisites: course.prerequisites || [],
    });
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this course?",
      content:
        "This will also delete all associated sections. This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setCourses(courses.filter((course) => course.id !== id));
        setSections(sections.filter((section) => section.courseId !== id));
        message.success("Course and associated sections deleted successfully");
      },
    });
  };

  const handleAddSection = () => {
    setEditingSection(null);
    sectionForm.resetFields();
    setIsSectionModalOpen(true);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    sectionForm.setFieldsValue({
      ...section,
      courseId: section.courseId,
      instructorId: section.instructor?.id,
    });
    setIsSectionModalOpen(true);
  };

  const handleDeleteSection = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this section?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setSections(sections.filter((section) => section.id !== id));
        message.success("Section deleted successfully");
      },
    });
  };

  const handleCourseModalOk = async () => {
    try {
      const values = await courseForm.validateFields();

      if (editingCourse) {
        const updatedCourse: Course = {
          ...editingCourse,
          ...values,
          dateUpdated: new Date().toISOString(),
        };

        setCourses(
          courses.map((course) =>
            course.id === editingCourse.id ? updatedCourse : course
          )
        );
        message.success("Course updated successfully");
      } else {
        const newCourse: Course = {
          id: `course-${Date.now()}`,
          ...values,
          status: "Active",
          dateCreated: new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
        };

        setCourses([...courses, newCourse]);
        message.success("Course created successfully");
      }

      setIsCourseModalOpen(false);
      courseForm.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleSectionModalOk = async () => {
    try {
      const values = await sectionForm.validateFields();

      if (editingSection) {
        const updatedSection: Section = {
          ...editingSection,
          ...values,
          course:
            courses.find((c) => c.id === values.courseId) ||
            editingSection.course,
          dateUpdated: new Date().toISOString(),
        };

        setSections(
          sections.map((section) =>
            section.id === editingSection.id ? updatedSection : section
          )
        );
        message.success("Section updated successfully");
      } else {
        const newSection: Section = {
          id: `section-${Date.now()}`,
          ...values,
          course: courses.find((c) => c.id === values.courseId)!,
          currentEnrollment: 0,
          status: "Open",
          dateCreated: new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
        };

        setSections([...sections, newSection]);
        message.success("Section created successfully");
      }

      setIsSectionModalOpen(false);
      sectionForm.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleGenerateDummyData = () => {
    const newCourses = Array.from({ length: 5 }, (_, index) =>
      generateCourse(courses.length + index + 1)
    );
    setCourses([...courses, ...newCourses]);
    message.success("5 dummy courses generated successfully");
  };

  const courseColumns: ColumnsType<Course> = [
    {
      title: "Course",
      key: "course",
      render: (_, record) => (
        <Space>
          <BookOutlined className="text-blue-500" />
          <div>
            <div className="font-medium">{record.courseCode}</div>
            <div className="text-sm text-gray-500">{record.courseName}</div>
          </div>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <div className="max-w-xs truncate" title={description}>
          {description || "No description"}
        </div>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Units",
      dataIndex: "units",
      key: "units",
      render: (units: number) => <Badge count={units} showZero color="blue" />,
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (department: string) => <Tag color="green">{department}</Tag>,
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Sections",
      key: "sections",
      render: (_, record) => {
        const courseSections = sections.filter((s) => s.courseId === record.id);
        return (
          <div className="flex items-center gap-2">
            <Badge count={courseSections.length} showZero color="purple" />
            <span className="text-sm text-gray-500">
              {courseSections.filter((s) => s.status === "Open").length} open
            </span>
          </div>
        );
      },
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              // Navigate to course details or show in modal
              message.info(`Viewing details for ${record.courseCode}`);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCourse(record.id)}
          />
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  const sectionColumns: ColumnsType<Section> = [
    {
      title: "Section",
      key: "section",
      render: (_, record) => (
        <Space>
          <BookOutlined className="text-purple-500" />
          <div>
            <div className="font-medium">{record.sectionCode}</div>
            <div className="text-sm text-gray-500">{record.sectionName}</div>
          </div>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Course",
      key: "course",
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.course.courseCode}</div>
          <div className="text-sm text-gray-500">
            {record.course.courseName}
          </div>
        </div>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Instructor",
      key: "instructor",
      render: (_, record) =>
        record.instructor ? (
          <div>
            <div className="font-medium">{record.instructor.name}</div>
            <div className="text-sm text-gray-500">
              {record.instructor.email}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Not assigned</span>
        ),
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Schedule",
      key: "schedule",
      render: (_, record) => (
        <div className="text-sm">
          {record.schedule.map((sched, index) => (
            <div key={index} className="text-xs">
              {sched.day} {sched.startTime}-{sched.endTime}
              {sched.room && ` (${sched.room})`}
            </div>
          ))}
        </div>
      ),
      responsive: ["lg", "xl"],
    },
    {
      title: "Enrollment",
      key: "enrollment",
      render: (_, record) => (
        <div className="text-center">
          <div className="font-medium">
            {record.currentEnrollment}/{record.maxCapacity}
          </div>
          <div className="text-xs text-gray-500">
            {Math.round((record.currentEnrollment / record.maxCapacity) * 100)}%
            full
          </div>
        </div>
      ),
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "Open" ? "green" : status === "Closed" ? "red" : "orange"
          }
        >
          {status}
        </Tag>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() =>
              message.info(`Viewing details for ${record.sectionCode}`)
            }
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditSection(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSection(record.id)}
          />
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-700 flex items-center gap-3">
            <BookOutlined className="text-green-600" />
            Course Management
          </h1>
          <p className="text-gray-500 mt-2">
            Create and manage courses and sections
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateDummyData}>Generate Dummy Data</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={
              activeTab === "courses" ? handleAddCourse : handleAddSection
            }
          >
            Add {activeTab === "courses" ? "Course" : "Section"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="mb-6">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center text-sm text-gray-500 mb-4"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li>
              <span
                className={
                  activeTab === "courses"
                    ? "text-blue-700 font-semibold flex items-center gap-1"
                    : "cursor-pointer hover:text-blue-600 flex items-center gap-1"
                }
                onClick={() => setActiveTab("courses")}
                style={{ userSelect: "none" }}
                role="button"
                aria-current={activeTab === "courses" ? "page" : undefined}
              >
                Courses <span className="ml-1">({courses.length})</span>
              </span>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span
                className={
                  activeTab === "sections"
                    ? "text-blue-700 font-semibold flex items-center gap-1"
                    : "cursor-pointer hover:text-blue-600 flex items-center gap-1"
                }
                onClick={() => setActiveTab("sections")}
                style={{ userSelect: "none" }}
                role="button"
                aria-current={activeTab === "sections" ? "page" : undefined}
              >
                Sections <span className="ml-1">({sections.length})</span>
              </span>
            </li>
          </ol>
        </nav>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder={`Search ${activeTab}...`}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div>
            <Select
              placeholder="Department"
              className="w-full"
              value={filters.department}
              onChange={(value) =>
                setFilters({ ...filters, department: value })
              }
              allowClear
            >
              {departments.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <Select
              placeholder="Status"
              className="w-full"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              allowClear
            >
              {statuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
        <Card>
          <div className="text-center">
            <Badge count={courses.length} showZero color="blue" />
            <div className="text-sm text-gray-600 mt-1">Total Courses</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Badge
              count={courses.filter((c) => c.status === "Active").length}
              showZero
              color="green"
            />
            <div className="text-sm text-gray-600 mt-1">Active Courses</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Badge count={sections.length} showZero color="purple" />
            <div className="text-sm text-gray-600 mt-1">Total Sections</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Badge
              count={sections.filter((s) => s.status === "Open").length}
              showZero
              color="green"
            />
            <div className="text-sm text-gray-600 mt-1">Open Sections</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        {activeTab === "courses" ? (
          <Table
            columns={courseColumns}
            dataSource={filteredCourses}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} courses`,
            }}
          />
        ) : (
          <Table
            columns={sectionColumns}
            dataSource={filteredSections}
            rowKey="id"
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} sections`,
            }}
          />
        )}
      </Card>

      {/* Add/Edit Course Modal */}
      <Modal
        title={editingCourse ? "Edit Course" : "Add New Course"}
        open={isCourseModalOpen}
        onCancel={() => {
          setIsCourseModalOpen(false);
          courseForm.resetFields();
        }}
        onOk={handleCourseModalOk}
        okText={editingCourse ? "Update Course" : "Add Course"}
        width={600}
      >
        <Form form={courseForm} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="courseCode"
              label="Course Code"
              rules={[{ required: true, message: "Please enter course code" }]}
            >
              <Input placeholder="e.g., CS101" />
            </Form.Item>
            <Form.Item
              name="units"
              label="Units"
              rules={[
                { required: true, message: "Please enter number of units" },
              ]}
            >
              <InputNumber min={1} max={6} className="w-full" placeholder="3" />
            </Form.Item>
          </div>
          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea
              rows={3}
              placeholder="Enter course description (optional)"
            />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please select department" }]}
            >
              <Select placeholder="Select department">
                {departments.map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="prerequisites" label="Prerequisites">
              <Select
                mode="multiple"
                placeholder="Select prerequisite courses"
                allowClear
              >
                {courses.map((course) => (
                  <Option key={course.id} value={course.id}>
                    {course.courseCode} - {course.courseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Add/Edit Section Modal */}
      <Modal
        title={editingSection ? "Edit Section" : "Add New Section"}
        open={isSectionModalOpen}
        onCancel={() => {
          setIsSectionModalOpen(false);
          sectionForm.resetFields();
        }}
        onOk={handleSectionModalOk}
        okText={editingSection ? "Update Section" : "Add Section"}
        width={700}
      >
        <Form form={sectionForm} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="sectionCode"
              label="Section Code"
              rules={[{ required: true, message: "Please enter section code" }]}
            >
              <Input placeholder="e.g., CS101-A" />
            </Form.Item>
            <Form.Item
              name="maxCapacity"
              label="Max Capacity"
              rules={[
                { required: true, message: "Please enter maximum capacity" },
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                className="w-full"
                placeholder="30"
              />
            </Form.Item>
          </div>
          <Form.Item
            name="sectionName"
            label="Section Name"
            rules={[{ required: true, message: "Please enter section name" }]}
          >
            <Input placeholder="Enter section name" />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="courseId"
              label="Course"
              rules={[{ required: true, message: "Please select course" }]}
            >
              <Select placeholder="Select course">
                {courses.map((course) => (
                  <Option key={course.id} value={course.id}>
                    {course.courseCode} - {course.courseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="semesterId"
              label="Semester"
              rules={[{ required: true, message: "Please select semester" }]}
            >
              <Select placeholder="Select semester">
                {semesters.map((semester) => (
                  <Option key={semester.id} value={semester.id}>
                    {semester.semesterName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="instructorId" label="Instructor (Optional)">
            <Select placeholder="Select instructor" allowClear>
              {/* This would typically come from an instructors API */}
              <Option value="instructor-1">Dr. Alice Johnson</Option>
              <Option value="instructor-2">Prof. Bob Smith</Option>
              <Option value="instructor-3">Dr. Carol Davis</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
