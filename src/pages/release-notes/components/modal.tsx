import TextArea from "@/components/custom/textarea";

interface ViewReleaseNotesTextAreaProps {
  note: string;
}
export default function ViewReleaseNotesTextArea({
  note,
}: ViewReleaseNotesTextAreaProps) {
  return <TextArea value={note} className="w-full h-[300px]" />;
}
