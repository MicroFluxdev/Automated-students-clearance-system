import { useState } from "react";
import { Card, List, Typography, Tag, Space, Button } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

const { Title, Text } = Typography;

interface Event {
  id: number;
  title: string;
  venue: string;
  description: string;
  dateStart: Date;
}

const Events = () => {
  // Sample events data
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Orientation Day",
      venue: "Main Auditorium",
      description: "Welcome event for new students",
      dateStart: new Date("2024-03-15"),
    },
    {
      id: 2,
      title: "Career Fair",
      venue: "Student Center",
      description: "Annual career fair with top companies",
      dateStart: new Date("2024-04-20"),
    },
    {
      id: 3,
      title: "Graduation Ceremony",
      venue: "University Stadium",
      description: "Class of 2024 graduation ceremony",
      dateStart: new Date("2024-05-25"),
    },
  ]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2} className="text-blue-500">
          Upcoming Events
        </Title>
        <Text type="secondary">Stay updated with campus events</Text>
      </div>

      <Card className="shadow-lg">
        <List
          itemLayout="vertical"
          dataSource={events}
          renderItem={(event) => (
            <List.Item
              key={event.id}
              className="hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Space direction="vertical" size={2}>
                    <Space>
                      <FileTextOutlined className="text-blue-500" />
                      <Title level={4} className="m-0">
                        {event.title}
                      </Title>
                    </Space>
                    <Space>
                      <EnvironmentOutlined className="text-green-500" />
                      <Text>{event.venue}</Text>
                    </Space>
                    <Text type="secondary">{event.description}</Text>
                  </Space>
                </div>
                <div className="flex flex-col items-end">
                  <Space direction="vertical" align="end">
                    <Tag color="blue" icon={<CalendarOutlined />}>
                      {format(event.dateStart, "MMM dd, yyyy")}
                    </Tag>
                    <Button type="link" size="small">
                      View Details
                    </Button>
                  </Space>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Events;
