import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/authentication/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  type Event,
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/services/eventService";

// Convert datetime-local (local time) → ISO (UTC)
const convertToPHTimeISO = (datetimeLocal: string): string => {
  const date = new Date(datetimeLocal);
  return date.toISOString();
};

// Convert ISO (UTC) → datetime-local format
const convertFromPHTimeToLocal = (isoString: string): string => {
  const date = new Date(isoString);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

// Format ISO → readable PH date/time
const formatPHDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  });
};

const Events = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    eventDate: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listEvents();
      setEvents(data);
    } catch (error) {
      toastRef.current({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      description: "",
      eventDate: "",
    });
    setEditingEvent(null);
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (event: Event) => {
    setEditingEvent(event);
    const dateTimeValue = convertFromPHTimeToLocal(event.eventDate);
    setFormData({
      title: event.title,
      location: event.location,
      description: event.description,
      eventDate: dateTimeValue,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.eventDate.trim()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        eventDate: convertToPHTimeISO(formData.eventDate),
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, submitData);
        toast({
          title: "Success",
          description: "Event updated successfully!",
        });
      } else {
        await createEvent(submitData);
        toast({
          title: "Success",
          description: "Event created successfully!",
        });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          editingEvent ? "update" : "create"
        } event. Please try again.`,
        variant: "destructive",
      });
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete);
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      });
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting event:", error);
    }
  };

  const handleDeleteClick = (eventId: number) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <div className="mx-auto">
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

          {role === "sao" && (
            <Button
              onClick={handleOpenCreateDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          )}
        </header>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Calendar className="h-16 w-16 mb-4 text-gray-400" />
            <p className="text-lg font-semibold">No events found</p>
            <p className="text-sm">Create your first event to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-blue-500"
              >
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-24 bg-blue-50 flex flex-row sm:flex-col items-center justify-center p-4 text-center gap-2 sm:gap-0">
                    <p className="text-sm font-semibold text-blue-700 uppercase">
                      {format(new Date(event.eventDate), "MMM")}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-800">
                      {format(new Date(event.eventDate), "dd")}
                    </p>
                  </div>

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
                        <span>{formatPHDateTime(event.eventDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {role === "sao" && (
                    <div className="p-4 sm:p-6 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditDialog(event)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(event.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CREATE/EDIT DIALOG */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent className="sm:max-w-[525px] w-[95%] rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {editingEvent
                  ? "Update the event details below"
                  : "Create a new event for the clearance system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="event-title">Title</Label>
                <Input
                  id="event-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Orientation Day"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Main Auditorium"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-date">Date & Time</Label>
                <Input
                  id="event-date"
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add short details about the event"
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>
              <DialogFooter className="flex justify-between sm:justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingEvent ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingEvent ? "Update" : "Create"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                event from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Events;
