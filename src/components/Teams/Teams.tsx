import { Card, Avatar } from "antd";
import "./Teams.css";

const Team = () => {
  const teamMembers = [
    {
      name: "Amaz Khan",
      role: "Frontend Engineer",
      bio: "Passionate about building scalable and user-friendly interfaces.",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "M. Kamran Ali",
      role: "Frontend Engineer",
      bio: "Passionate about building scalable and user-friendly interfaces.",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Zain Naeem",
      role: "Backend Engineer",
      bio: "Focuses on performance, security, and clean architecture.",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      name: "M. Moeez",
      role: "Backend Engineer",
      bio: "Focuses on performance, security, and clean architecture.",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  ];

  return (
    <section className="teamSection">
      <div className="teamContainer">
        <h2 className="teamTitle">Meet the Team</h2>
        <p className="teamSubtitle">
          The people behind DeltaTrack who work hard to build reliable developer
          tools.
        </p>

        <div className="teamGrid">
          {teamMembers.map((member, index) => (
            <Card key={index} className="teamCard" bordered={false}>
              <Avatar size={96} src={member.avatar} className="teamAvatar" />
              <h3 className="memberName">{member.name}</h3>
              <div className="memberRole">{member.role}</div>
              <p className="memberBio">{member.bio}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
