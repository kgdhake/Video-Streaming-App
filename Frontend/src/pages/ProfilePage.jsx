import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  PencilIcon,
  SaveIcon,
  ShuffleIcon,
  XIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import { capitialize } from "../lib/utils.js";
import { getLanguageFlag } from "../components/FriendCard.jsx";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation(formState);
  };

  const handleCancel = () => {
    setFormState({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      learningLanguage: authUser?.learningLanguage || "",
      location: authUser?.location || "",
      profilePic: authUser?.profilePic || "",
    });
    setIsEditing(false);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${idx}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Profile</h2>
          {!isEditing && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(true)}>
              <PencilIcon className="size-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile View / Edit */}
        {!isEditing ? (
          /* ---- VIEW MODE ---- */
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-6 sm:p-8 space-y-6">
              {/* Avatar + Name */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="size-28 rounded-full bg-base-300 overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
                  {authUser?.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold">{authUser?.fullName}</h3>
                  <p className="text-base-content opacity-60 text-sm mt-1">{authUser?.email}</p>
                  {authUser?.location && (
                    <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start">
                      <MapPinIcon className="size-4 opacity-70" />
                      <span className="text-sm opacity-70">{authUser.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {authUser?.bio && (
                <div>
                  <h4 className="text-sm font-semibold opacity-70 mb-1">About</h4>
                  <p className="text-base-content">{authUser.bio}</p>
                </div>
              )}

              {/* Languages */}
              <div>
                <h4 className="text-sm font-semibold opacity-70 mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {authUser?.nativeLanguage && (
                    <span className="badge badge-secondary badge-lg gap-1">
                      {getLanguageFlag(authUser.nativeLanguage)}
                      Native: {capitialize(authUser.nativeLanguage)}
                    </span>
                  )}
                  {authUser?.learningLanguage && (
                    <span className="badge badge-outline badge-lg gap-1">
                      {getLanguageFlag(authUser.learningLanguage)}
                      Learning: {capitialize(authUser.learningLanguage)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-300 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{authUser?.friends?.length || 0}</p>
                  <p className="text-sm opacity-70">Friends</p>
                </div>
                <div className="bg-base-300 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-secondary">
                    {new Date(authUser?.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm opacity-70">Joined</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ---- EDIT MODE ---- */
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Pic */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="size-28 rounded-full bg-base-300 overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
                    {formState.profilePic ? (
                      <img
                        src={formState.profilePic}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CameraIcon className="size-12 text-base-content opacity-40" />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={handleRandomAvatar} className="btn btn-accent btn-sm">
                    <ShuffleIcon className="size-4 mr-2" />
                    Generate Random Avatar
                  </button>
                </div>

                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="input input-bordered w-full"
                    placeholder="Your full name"
                  />
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="textarea textarea-bordered h-24"
                    placeholder="Tell others about yourself and your language learning goals"
                  />
                </div>

                {/* Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Native Language</span>
                    </label>
                    <select
                      name="nativeLanguage"
                      value={formState.nativeLanguage}
                      onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select your native language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Learning Language</span>
                    </label>
                    <select
                      name="learningLanguage"
                      value={formState.learningLanguage}
                      onChange={(e) =>
                        setFormState({ ...formState, learningLanguage: e.target.value })
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="">Select language you're learning</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="input input-bordered w-full pl-10"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button className="btn btn-primary flex-1" disabled={isPending} type="submit">
                    {isPending ? (
                      <>
                        <LoaderIcon className="animate-spin size-5 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="size-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={handleCancel} disabled={isPending}>
                    <XIcon className="size-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
