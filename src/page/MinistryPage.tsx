import React from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Heart, Users } from 'lucide-react';

export const MinistryPage = () => {
  const { type } = useParams();
  
  const getContent = () => {
    switch(type) {
      case 'prayer-guides':
        return {
          title: "Prayer Guides",
          icon: <BookOpen className="text-red-500" size={48} />,
          desc: "Resources to strengthen your prayer life.",
          content: "Access our daily prayer points, fasting guides, and intercessory manuals designed to help you maintain a fervent spiritual life."
        };
      case 'special-programs':
        return {
          title: "Special Programs",
          icon: <Users className="text-blue-500" size={48} />,
          desc: "Events tailored for specific groups.",
          content: "From Youth Camps to Couples' Retreats, discover the special programs we organize to cater to the unique needs of every demographic in the church."
        };
      default:
        return {
          title: "Ministry",
          icon: <Heart className="text-pink-500" size={48} />,
          desc: "Serving God and people.",
          content: "Explore the various ways Betefage International Church is serving the community and the body of Christ."
        };
    }
  };

  const info = getContent();

  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-20 flex items-center justify-center">
       <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-zinc-900 p-6 rounded-full inline-block mb-8 shadow-lg shadow-red-900/20 border border-zinc-800">
            {info.icon}
          </div>
          <h1 className="text-4xl font-bold mb-4">{info.title}</h1>
          <p className="text-xl text-gray-300 mb-8">{info.desc}</p>
          <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 leading-relaxed text-gray-400">
             {info.content}
             <div className="mt-8 pt-8 border-t border-zinc-800">
               <p className="italic">More content coming soon to this section.</p>
             </div>
          </div>
       </div>
    </div>
  );
};
