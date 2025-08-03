import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Plus } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: number;
  title: string;
  venue: string;
  description: string;
  dateStart: string;
}

const Events = () => {
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Freshmen Orientation",
      venue: "University Grand Theater",
      description:
        "A university-wide event to welcome all incoming first-year students. Get to know your campus, meet fellow students, and learn about the resources available to you.",
      dateStart: "2024-08-15",
    },
    {
      id: 2,
      title: "Tech Summit 2024",
      venue: "College of Engineering Auditorium",
      description:
        "An annual conference featuring talks from industry leaders on the latest trends in technology, including AI, cybersecurity, and software development.",
      dateStart: "2024-09-20",
    },
    {
      id: 3,
      title: "University Founders' Day",
      venue: "Campus Grounds",
      description:
        "A week-long celebration of the university's founding anniversary, with various activities, competitions, and a grand closing ceremony.",
      dateStart: "2024-10-10",
    },
    {
      id: 4,
      title: "Annual Job Fair",
      venue: "Student Union Building",
      description:
        "Connect with top companies and explore internship and job opportunities in your field. Open to all graduating students and alumni.",
      dateStart: "2024-11-05",
    },
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Upcoming Events
            </h1>
            <p className="text-gray-500 mt-1">
              Stay informed about the latest happenings on campus.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </header>

        <div className="space-y-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500"
            >
              <CardContent className="p-0 flex">
                <div className="w-24 bg-blue-50 flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-sm font-semibold text-blue-700 uppercase">
                    {format(new Date(event.dateStart), "MMM")}
                  </p>
                  <p className="text-3xl font-bold text-blue-800">
                    {format(new Date(event.dateStart), "dd")}
                  </p>
                </div>
                <div className="flex-1 p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <p className="text-gray-600 mb-4 text-sm">
                    {event.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 space-x-6">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {format(
                          new Date(event.dateStart),
                          "EEEE, MMMM d, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex items-center">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
