import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Edit2,
  ExternalLink,
  Gift,
  LogIn,
  LogOut,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { GiftPackageContent } from "../backend.d";
import { Variant_published_draft } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreatePackage,
  useDeletePackage,
  useListMyPackages,
} from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: packages, isLoading } = useListMyPackages();
  const createPackage = useCreatePackage();
  const deletePackage = useDeletePackage();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    try {
      const pkg = await createPackage.mutateAsync("My Surprise Kit");
      navigate({ to: "/create/$id", params: { id: pkg.id } });
    } catch {
      toast.error("Failed to create kit");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deletePackage.mutateAsync(id);
      toast.success("Kit deleted");
    } catch {
      toast.error("Failed to delete kit");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShare = (pkg: GiftPackageContent) => {
    if (!pkg.shareToken) {
      toast.error("Publish first to get a share link");
      return;
    }
    const url = `${window.location.origin}/s/${pkg.shareToken}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(pkg.id);
      toast.success("Share link copied!");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen paper-texture">
      {/* Header */}
      <header className="blush-gradient border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Gift className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              Surprise Kit
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground/70">
              My Kits
            </span>
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="gap-1.5"
                data-ocid="nav.logout_button"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="gap-1.5"
                data-ocid="nav.login_button"
              >
                <LogIn className="w-3.5 h-3.5" />{" "}
                {isLoggingIn ? "Connecting..." : "Sign In"}
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Your Gift Kits
          </h1>
          <p className="text-muted-foreground text-lg">
            Create personalised surprise packages for the people you love.
          </p>
          <Button
            onClick={handleCreate}
            disabled={createPackage.isPending}
            className="mt-6 rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-card"
            data-ocid="dashboard.primary_button"
          >
            <Plus className="w-4 h-4 mr-2" />
            {createPackage.isPending ? "Creating..." : "Create New Kit"}
          </Button>
        </motion.div>

        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Sign in to get started
            </h2>
            <p className="text-muted-foreground mb-6">
              Connect your identity to create and manage surprise kits.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="rounded-full px-8"
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? "Connecting..." : "Sign In"}
            </Button>
          </motion.div>
        )}

        {isAuthenticated && (
          <>
            {isLoading && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-ocid="kits.loading_state"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                  <Skeleton key={i} className="h-48 rounded-2xl" />
                ))}
              </div>
            )}

            {!isLoading && (!packages || packages.length === 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
                data-ocid="kits.empty_state"
              >
                <div className="text-6xl mb-4">✨</div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  No kits yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create your first surprise kit and make someone&apos;s day
                  magical.
                </p>
                <Button
                  onClick={handleCreate}
                  className="rounded-full px-8"
                  data-ocid="kits.empty_create_button"
                >
                  Create Your First Kit
                </Button>
              </motion.div>
            )}

            {!isLoading && packages && packages.length > 0 && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                data-ocid="kits.list"
              >
                <AnimatePresence>
                  {packages.map((pkg, i) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-2xl p-5 card-shadow border border-border group hover:card-shadow-lg transition-shadow"
                      data-ocid={`kits.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-xl">
                          🎁
                        </div>
                        <Badge
                          variant={
                            pkg.status === Variant_published_draft.published
                              ? "default"
                              : "secondary"
                          }
                          className="rounded-full text-xs"
                        >
                          {pkg.status === Variant_published_draft.published
                            ? "Published"
                            : "Draft"}
                        </Badge>
                      </div>
                      <h3 className="font-display font-bold text-lg mb-1 truncate">
                        {pkg.title || "Untitled Kit"}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Updated {formatDate(pkg.updatedAt)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full flex-1 text-xs"
                          onClick={() =>
                            navigate({
                              to: "/create/$id",
                              params: { id: pkg.id },
                            })
                          }
                          data-ocid={`kits.edit_button.${i + 1}`}
                        >
                          <Edit2 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full text-xs"
                          onClick={() => handleShare(pkg)}
                          data-ocid={`kits.secondary_button.${i + 1}`}
                        >
                          {copiedId === pkg.id ? (
                            "Copied!"
                          ) : (
                            <Share2 className="w-3 h-3" />
                          )}
                        </Button>
                        {pkg.shareToken && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full text-xs"
                            onClick={() =>
                              window.open(`/s/${pkg.shareToken}`, "_blank")
                            }
                            data-ocid={`kits.link.${i + 1}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-full text-destructive hover:text-destructive text-xs"
                              data-ocid={`kits.delete_button.${i + 1}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                            className="rounded-2xl"
                            data-ocid="delete.dialog"
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this kit?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. The kit and all
                                its contents will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className="rounded-full"
                                data-ocid="delete.cancel_button"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="rounded-full bg-destructive text-destructive-foreground"
                                onClick={() => handleDelete(pkg.id)}
                                disabled={deletingId === pkg.id}
                                data-ocid="delete.confirm_button"
                              >
                                {deletingId === pkg.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="text-center py-8 mt-16 border-t border-border">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
