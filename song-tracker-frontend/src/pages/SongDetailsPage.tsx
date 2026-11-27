import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import * as v from "valibot";
import { SpotifySong } from "@/api/schemas/SongSchema";
import {
  type UpdateUserSong,
  type UserSong,
} from "@/api/schemas/UserSongSchema";
import { getSpotifySong } from "@/api/songs";
import { getUserSongs, saveUserSong, updateUserSong } from "@/api/userSongs";
import { Head } from "@/components/Head";
import { LoadingOrError } from "@/components/LoadingOrError";
import { AlbumArt } from "@/components/songDisplay/SongCard";
import { StatusControl } from "@/components/songDisplay/StatusControl";
import { useAuth } from "@/context/AuthContext";

const DETAIL_ART_SIZE = 100;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

function BackLink() {
  const navigate = useNavigate();

  if (globalThis.history.length > 1) {
    return (
      <button
        className="cursor-pointer self-start text-slate-400 text-sm hover:text-slate-200"
        onClick={() => navigate(-1)}
        type="button"
      >
        &larr; Back
      </button>
    );
  }

  return (
    <Link
      className="self-start text-slate-400 text-sm hover:text-slate-200"
      to="/"
    >
      &larr; All songs
    </Link>
  );
}

interface DetailRowProps {
  label: string;
  value: ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between gap-x-4 border-slate-700 border-b py-2">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

interface TrackingDetailsProps {
  userSong: UserSong | undefined;
}

function TrackingDetails({ userSong }: TrackingDetailsProps) {
  if (userSong === undefined) {
    return null;
  }

  return (
    <dl className="w-full text-sm">
      {userSong.lastPractised && (
        <DetailRow
          label="Last Practised"
          value={dateFormatter.format(userSong.lastPractised)}
        />
      )}
      <DetailRow
        label="Capo"
        value={userSong.capo === null ? "Not set" : `Fret ${userSong.capo}`}
      />
      <DetailRow
        label="Difficulty"
        value={
          userSong.difficultyRating === null
            ? "Not rated"
            : `${userSong.difficultyRating} / 5`
        }
      />
      <DetailRow
        label="Added"
        value={dateFormatter.format(userSong.dateAdded)}
      />
    </dl>
  );
}

type UserSongChanges = Omit<UpdateUserSong, "id">;

type UserSongChangeHandler = <K extends keyof UserSongChanges>(
  field: K,
  value: Required<UserSongChanges>[K],
) => void;

interface SongActionsProps {
  isLoggedIn: boolean;
  isSaving: boolean;
  isUpdating: boolean;
  onSave: () => void;
  onUserSongChange: UserSongChangeHandler;
  userSong: UserSong | undefined;
}

function SongActions({
  isLoggedIn,
  isSaving,
  isUpdating,
  onSave,
  onUserSongChange,
  userSong,
}: SongActionsProps) {
  if (userSong !== undefined) {
    return (
      <div className="flex flex-row justify-between gap-x-4">
        <StatusControl
          isPending={isUpdating}
          onChange={(status) => onUserSongChange("status", status)}
          status={userSong.status}
        />
        <button
          className="cursor-pointer rounded-sm bg-blue-500 p-2 text-center hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-600"
          disabled={isUpdating}
          onClick={() => onUserSongChange("lastPractised", new Date())}
          type="button"
        >
          {isUpdating ? "Updating..." : "Practised today"}
        </button>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link
        className="rounded-sm bg-blue-500 p-2 text-center hover:bg-blue-400"
        to="/login"
      >
        Log in to save this song
      </Link>
    );
  }

  return (
    <button
      className="cursor-pointer rounded-sm bg-blue-500 p-2 text-center hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-600"
      disabled={isSaving}
      onClick={onSave}
      type="button"
    >
      {isSaving ? "Saving..." : "Want to learn"}
    </button>
  );
}

interface SongDetailsProps {
  spotifyId: string;
}

function SongDetails({ spotifyId }: SongDetailsProps) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  const seed = v.safeParse(
    SpotifySong,
    (location.state as { song?: unknown } | null)?.song,
  );

  const songQuery = useQuery({
    queryFn: () => getSpotifySong(spotifyId),
    queryKey: ["spotifySong", spotifyId],
    staleTime: Number.POSITIVE_INFINITY,
    ...(seed.success ? { initialData: seed.output } : {}),
  });

  const userSongsQuery = useQuery({
    enabled: isLoggedIn,
    queryFn: getUserSongs,
    queryKey: ["userSongs"],
  });

  const userSong = userSongsQuery.data?.find(
    (entry) => entry.song.spotifyId === spotifyId,
  );

  const saveMutation = useMutation({
    mutationFn: () => saveUserSong(spotifyId),
    onError: () => toast.error("Could not save that song. Try again."),
    onSuccess: async (saved) => {
      await queryClient.invalidateQueries({ queryKey: ["userSongs"] });
      toast.success(`Saved ${saved.song.title}`);
    },
  });

  const userSongMutation = useMutation({
    mutationFn: (changes: UpdateUserSong) => updateUserSong(changes),
    onError: () => toast.error("Could not update that song. Try again."),
    onSuccess: async (updated) => {
      await queryClient.invalidateQueries({ queryKey: ["userSongs"] });
      toast.success(`Successfully updated ${updated.song.title}`);
    },
  });

  const handleUserSongChange: UserSongChangeHandler = (field, value) => {
    if (userSong === undefined) {
      return;
    }

    userSongMutation.mutate({
      id: userSong.id,
      ...({ [field]: value } as Pick<UserSongChanges, typeof field>),
    });
  };

  if (songQuery.isPending) {
    return <LoadingOrError />;
  }

  if (songQuery.isError) {
    return <LoadingOrError error={songQuery.error} />;
  }

  const song = songQuery.data;

  return (
    <div className="flex flex-col items-center p-4">
      <Head title={`${song.title} - SongTracker`} />
      <div className="flex w-full max-w-md flex-col gap-y-4">
        <BackLink />
        <AlbumArt
          album={song.album}
          className="aspect-square w-full shrink-0 self-center rounded-sm"
          imageUrl={song.imageUrl}
          size={DETAIL_ART_SIZE}
        />
        <div className="flex flex-col gap-y-1">
          <h1 className="font-bold text-xl">{song.title}</h1>
          <p className="text-slate-400">{song.album}</p>
          <p>{song.artist}</p>
        </div>
        <SongActions
          isLoggedIn={isLoggedIn}
          isSaving={saveMutation.isPending}
          isUpdating={userSongMutation.isPending}
          onSave={() => saveMutation.mutate()}
          onUserSongChange={handleUserSongChange}
          userSong={userSong}
        />
        <TrackingDetails userSong={userSong} />
      </div>
    </div>
  );
}

export function SongDetailsPage() {
  const { spotifyId } = useParams();

  if (spotifyId === undefined) {
    return <p className="p-4">That song link is missing an id.</p>;
  }

  return <SongDetails spotifyId={spotifyId} />;
}