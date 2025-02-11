
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Calendar, FileText } from "lucide-react";

interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  fullName: string;
  studentNumber: string;
  email: string;
  phoneNumber: string;
  course: string;
  yearOfStudy: string;
  aiInterestArea: string[];
  linkedinProfile: string;
  githubProfile: string;
  learningStyle: string;
  motivation: string;
  status: string;
  createdAt: Date;
}

interface Event {
  id: string;
  name: string;
  date: string;
}

const EventRegistrationsView = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      setEvents(eventsData);

      const registrationsSnapshot = await getDocs(collection(db, "eventRegistrations"));
      const registrationsData = registrationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as EventRegistration[];
      setRegistrations(registrationsData);
    };

    fetchData();
  }, []);

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Event Registrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.map(event => (
          <div key={event.id} className="mb-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-blue-600" />
              {event.name} - {event.date}
            </h3>
            
            <div className="space-y-4">
              {registrations
                .filter(reg => reg.eventId === event.id)
                .map(registration => (
                  <div key={registration.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{registration.fullName}</h4>
                        <p className="text-sm text-gray-600">{registration.email}</p>
                      </div>
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Student Number:</strong> {registration.studentNumber}</p>
                        <p><strong>Course:</strong> {registration.course}</p>
                        <p><strong>Year:</strong> {registration.yearOfStudy}</p>
                      </div>
                      <div>
                        <p><strong>Phone:</strong> {registration.phoneNumber}</p>
                        <p><strong>Learning Style:</strong> {registration.learningStyle}</p>
                        <p><strong>AI Interests:</strong> {registration.aiInterestArea.join(", ")}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm"><strong>Motivation:</strong></p>
                      <p className="text-sm text-gray-600">{registration.motivation}</p>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <a 
                        href={registration.linkedinProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                      <a 
                        href={registration.githubProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EventRegistrationsView;
