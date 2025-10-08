import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Plus } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Event {
  id: number;
  title: string;
  venue: string;
  description: string;
  dateStart: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([
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

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [newEventVenue, setNewEventVenue] = useState<string>("");
  const [newEventDescription, setNewEventDescription] = useState<string>("");
  const [newEventDateStart, setNewEventDateStart] = useState<string>("");

  const resetForm = () => {
    setNewEventTitle("");
    setNewEventVenue("");
    setNewEventDescription("");
    setNewEventDateStart("");
  };

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDateStart.trim()) return;
    const nextId =
      events.length > 0 ? Math.max(...events.map((ev) => ev.id)) + 1 : 1;
    const newEvent: Event = {
      id: nextId,
      title: newEventTitle.trim(),
      venue: newEventVenue.trim() || "TBA",
      description: newEventDescription.trim(),
      dateStart: newEventDateStart,
    };
    setEvents((prev) => [...prev, newEvent]);
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Upcoming Events
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Stay informed about the latest happenings on campus.
            </p>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[525px] w-[95%] rounded-xl">
              <DialogHeader>
                <DialogTitle>Add new event</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Manage students for Automated Student Clearance System
              </DialogDescription>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-title">Title</Label>
                  <Input
                    id="event-title"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g., Orientation Day"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-venue">Venue</Label>
                  <Input
                    id="event-venue"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    placeholder="e.g., Main Auditorium"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={newEventDateStart}
                    onChange={(e) => setNewEventDateStart(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={newEventDescription}
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    placeholder="Add short details about the event"
                    rows={4}
                  />
                </div>
                <DialogFooter className="flex justify-between sm:justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {/* EVENT LIST */}
        <div className="space-y-6">
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-blue-500"
            >
              <CardContent className="p-0 flex flex-col sm:flex-row">
                {/* Date */}
                <div className="w-full sm:w-24 bg-blue-50 flex flex-row sm:flex-col items-center justify-center p-4 text-center gap-2 sm:gap-0">
                  <p className="text-sm font-semibold text-blue-700 uppercase">
                    {format(new Date(event.dateStart), "MMM")}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-800">
                    {format(new Date(event.dateStart), "dd")}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6">
                  <CardHeader className="p-0 mb-3 sm:mb-4">
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 sm:space-x-6 space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>
                        {format(
                          new Date(event.dateStart),
                          "EEEE, MMMM d, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 sm:p-6 flex items-center justify-end">
                  <Button size="sm" className="w-full sm:w-auto space-x-2">
                    <Calendar />
                    Add to Calendar
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
