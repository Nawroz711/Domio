import { useProfile } from '../../hooks/useProfile'

export default function Profile() {
  const {
    user,
    formData,
    confirmName,
    isLoading,
    isSaving,
    isDeleting,
    avatarPreview,
    isUploadingAvatar,
    fileInputRef,
    handleChange,
    handleSubmit,
    setConfirmName,
    handleDeleteAccount,
    handleAvatarChange,
    triggerFileInput,
  } = useProfile()

  return (
    <main className="min-h-screen px-4 pb-16 pt-6 sm:px-6">
      <section className="mx-auto w-full rounded-xl p-5 sm:p-6 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-primary">My Profile</h1>
            <p className="mt-1 text-sm text-gray-700">Manage your profile information</p>
          </div>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-400">Loading profile...</p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
              <div className="group relative mb-4 sm:mb-0">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-3xl font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-gray-700">Profile Photo</p>
                <p className="mt-1 text-xs text-gray-500">
                  Upload a photo. Max size 5MB (jpeg, jpg, png, gif, webp)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-slate-400 outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder={'+937xxxxxxxx or 07xxxxxxxx'}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder={'Enter address'}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="mt-2 rounded-lg cursor-pointer bg-primary px-5 py-2.5 text-sm font-semibold text-dark transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>

            </div>
          </form>
        )}

      </section>

      {!isLoading && (
        <section className="mx-auto block mt-12 w-full p-5 sm:p-6 border border-red-200 rounded-xl">
          <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
          <p className="mt-2 text-sm text-red-500">
            Delete your account permanently. Type `{user?.name}` exactly to confirm.
          </p>

          <div className="mt-4">
            <input
              id="confirmName"
              value={confirmName}
              onChange={(event) => setConfirmName(event.target.value)}
              className="w-6/12 rounded-md border border-red-500/50 px-3 py-2.5 text-red-500 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="mt-4 rounded-md bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isDeleting ? 'Deleting...' : 'Delete account'}
          </button>
        </section>
      )}
    </main>
  )
}
