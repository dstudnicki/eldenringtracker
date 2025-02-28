import { Separator } from "@/components/ui/separator";
import { ProfileCharacters } from "@/components/profile-characters";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Character Profiles</h3>
        <p className="text-sm text-muted-foreground">
          Here you can manage your Elden Ring characters.
        </p>
      </div>
      <Separator />
      <ProfileCharacters />
    </div>
  );
}
