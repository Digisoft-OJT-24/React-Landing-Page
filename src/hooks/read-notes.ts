import { useState, useEffect } from "react";

const useReleaseNotes = (id: string) => {
  const [releaseNotes, setReleaseNotes] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchReleaseNotes = async () => {
      try {
        const response = await fetch(`/downloads/${id.toLowerCase()}-changelog.txt`);

        if (!response.ok) {
          setReleaseNotes("No release notes found.");
          return;
        }

        // Ensure response is plain text
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("text/plain")) {
          const text = await response.text();
          setReleaseNotes(text);
        } else {
          setReleaseNotes("No release notes found.");
        }
      } catch (error) {
        console.error(error);
        setReleaseNotes("Error fetching release notes.");
      }
    };

    fetchReleaseNotes();
  }, [id]);

  return releaseNotes;
};

export default useReleaseNotes;
