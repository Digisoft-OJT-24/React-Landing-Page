import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProductDetailsData = {
  getProducts: {
    code: string;
    versions: { id: string; version: string; link: string }[];
    changeLogs: {
      id: string;
      version: string;
      date: string;
      revision: number;
      description: string;
    }[];
    downloads: { id: string; title: string; link: string }[];
  }[];
};

type ProductDetailsDialogProps = {
  productCode: string;
};

export default function ProductDetailsDialog({
  productCode,
}: ProductDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<"versions" | "changelogs" | "downloads">("versions");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch product details
  const getProductDetailsQuery = gql`
    query GetProductDetails($code: String!) {
      getProducts(where: { code: { eq: $code } }) {
        code
        versions {
          id
          version
          link
        }
        changeLogs {
          id
          version
          date
          revision
          description
        }
        downloads {
          id
          title
          link
        }
      }
    }
  `;

  const { data, isLoading } = useQuery<ProductDetailsData>({
    queryKey: ["product-details", productCode],
    queryFn: async () =>
      request(import.meta.env.VITE_API_URL, getProductDetailsQuery, {
        code: productCode,
      }),
    enabled: isOpen,
  });

  const product = data?.getProducts?.[0];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage {productCode}</DialogTitle>
          <DialogDescription>
            Manage versions, changelogs, and downloads for this product
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setActiveTab("versions")}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === "versions"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Versions
              </button>
              <button
                onClick={() => setActiveTab("changelogs")}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === "changelogs"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Changelogs
              </button>
              <button
                onClick={() => setActiveTab("downloads")}
                className={`px-4 py-2 font-medium transition-colors ${activeTab === "downloads"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Downloads
              </button>
            </div>

            {/* Versions Tab */}
            {activeTab === "versions" && (
              <VersionsTab productCode={productCode} versions={product?.versions || []} />
            )}

            {/* Changelogs Tab */}
            {activeTab === "changelogs" && (
              <ChangelogsTab
                productCode={productCode}
                changelogs={product?.changeLogs || []}
              />
            )}

            {/* Downloads Tab */}
            {activeTab === "downloads" && (
              <DownloadsTab
                productCode={productCode}
                downloads={product?.downloads || []}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Versions Tab Component
function VersionsTab({
  productCode,
  versions,
}: {
  productCode: string;
  versions: { id: string; version: string; link: string }[];
}) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<{
    id: string;
    version: string;
    link: string;
  } | null>(null);
  const [formData, setFormData] = useState({ version: "", link: "" });

  const createVersionMutation = gql`
    mutation CreateVersion($productCode: String!, $version: String!, $link: String!) {
      createProductVersion(productCode: $productCode, version: $version, link: $link) {
        id
        version
        link
      }
    }
  `;

  const createMutation = useMutation({
    mutationFn: async (variables: {
      productCode: string;
      version: string;
      link: string;
    }) =>
      request(import.meta.env.VITE_API_URL, createVersionMutation, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
      setIsCreateOpen(false);
      setFormData({ version: "", link: "" });
    },
  });

  const updateVersionMutation = gql`
    mutation UpdateVersion($id: Int!, $version: String!, $link: String!) {
      updateProductVersion(id: $id, version: $version, link: $link) {
        id
        version
        link
      }
    }
  `;

  const updateMutation = useMutation({
    mutationFn: async (variables: { id: number; version: string; link: string }) =>
      request(import.meta.env.VITE_API_URL, updateVersionMutation, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
      setEditingVersion(null);
      setFormData({ version: "", link: "" });
    },
  });

  const deleteVersionMutation = gql`
    mutation DeleteVersion($id: Int!) {
      deleteProductVersion(id: $id)
    }
  `;

  const deleteMutation = useMutation({
    mutationFn: async (variables: { id: number }) =>
      request(import.meta.env.VITE_API_URL, deleteVersionMutation, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Version
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.length > 0 ? (
            versions.map((version) => (
              <TableRow key={version.id}>
                <TableCell>{version.version}</TableCell>
                <TableCell className="max-w-xs truncate">{version.link}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingVersion(version);
                        setFormData({ version: version.version, link: version.link });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this version?")) {
                          deleteMutation.mutate({ id: parseInt(version.id) });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No versions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Version</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Version</Label>
              <Input
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
                placeholder="e.g., 1.0.0"
              />
            </div>
            <div className="grid gap-2">
              <Label>Download Link</Label>
              <Input
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                createMutation.mutate({
                  productCode,
                  version: formData.version,
                  link: formData.link,
                });
              }}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingVersion} onOpenChange={(open) => !open && setEditingVersion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Version</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Version</Label>
              <Input
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Download Link</Label>
              <Input
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingVersion(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingVersion) {
                  updateMutation.mutate({
                    id: parseInt(editingVersion.id),
                    version: formData.version,
                    link: formData.link,
                  });
                }
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Changelogs Tab Component
function ChangelogsTab({
  productCode,
  changelogs,
}: {
  productCode: string;
  changelogs: {
    id: string;
    version: string;
    date: string;
    revision: number;
    description: string;
  }[];
}) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingChangelog, setEditingChangelog] = useState<{
    id: string;
    version: string;
    date: string;
    revision: number;
    description: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    version: "",
    date: new Date().toISOString().split("T")[0],
    revision: "1",
    description: "",
  });

  const createChangelogMutation = gql`
    mutation CreateChangelog(
      $appName: String!
      $version: String!
      $date: DateTime!
      $revision: Int!
      $description: String!
    ) {
      createChangelog(
        appName: $appName
        version: $version
        date: $date
        revision: $revision
        description: $description
      ) {
        id
        version
        date
        revision
        description
      }
    }
  `;

  const createMutation = useMutation({
    mutationFn: async (variables: {
      appName: string;
      version: string;
      date: string;
      revision: number;
      description: string;
    }) =>
      request(import.meta.env.VITE_API_URL, createChangelogMutation, {
        ...variables,
        date: new Date(variables.date).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
      setIsCreateOpen(false);
      setFormData({
        version: "",
        date: new Date().toISOString().split("T")[0],
        revision: "1",
        description: "",
      });
    },
  });

  const updateChangelogMutation = gql`
    mutation UpdateChangelog(
      $id: Int!
      $version: String!
      $date: DateTime!
      $revision: Int!
      $description: String!
    ) {
      updateChangelog(
        id: $id
        version: $version
        date: $date
        revision: $revision
        description: $description
      ) {
        id
        version
        date
        revision
        description
      }
    }
  `;

  const updateMutation = useMutation({
    mutationFn: async (variables: {
      id: number;
      version: string;
      date: string;
      revision: number;
      description: string;
    }) =>
      request(import.meta.env.VITE_API_URL, updateChangelogMutation, {
        ...variables,
        date: new Date(variables.date).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
      setEditingChangelog(null);
      setFormData({
        version: "",
        date: new Date().toISOString().split("T")[0],
        revision: "1",
        description: "",
      });
    },
  });

  const deleteChangelogMutation = gql`
    mutation DeleteChangelog($id: Int!) {
      deleteChangelog(id: $id)
    }
  `;

  const deleteMutation = useMutation({
    mutationFn: async (variables: { id: number }) =>
      request(import.meta.env.VITE_API_URL, deleteChangelogMutation, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Changelog
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Revision</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {changelogs.length > 0 ? (
            changelogs
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((changelog) => (
                <TableRow key={changelog.id}>
                  <TableCell>{changelog.version}</TableCell>
                  <TableCell>
                    {new Date(changelog.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{changelog.revision}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {changelog.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingChangelog(changelog);
                          setFormData({
                            version: changelog.version,
                            date: changelog.date.split("T")[0],
                            revision: changelog.revision.toString(),
                            description: changelog.description,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this changelog?")) {
                            deleteMutation.mutate({ id: parseInt(changelog.id) });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No changelogs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Changelog</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Version</Label>
              <Input
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
                placeholder="e.g., 1.0.0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Revision</Label>
                <Input
                  type="number"
                  value={formData.revision}
                  onChange={(e) =>
                    setFormData({ ...formData, revision: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Changelog description"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                createMutation.mutate({
                  appName: productCode,
                  version: formData.version,
                  date: formData.date,
                  revision: parseInt(formData.revision),
                  description: formData.description,
                });
              }}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingChangelog}
        onOpenChange={(open) => !open && setEditingChangelog(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Changelog</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Version</Label>
              <Input
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Revision</Label>
                <Input
                  type="number"
                  value={formData.revision}
                  onChange={(e) =>
                    setFormData({ ...formData, revision: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingChangelog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingChangelog) {
                  updateMutation.mutate({
                    id: parseInt(editingChangelog.id),
                    version: formData.version,
                    date: formData.date,
                    revision: parseInt(formData.revision),
                    description: formData.description,
                  });
                }
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Downloads Tab Component
function DownloadsTab({
  productCode,
  downloads,
}: {
  productCode: string;
  downloads: { id: string; title: string; link: string }[];
}) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<{
    id: string;
    title: string;
    link: string;
  } | null>(null);
  const [formData, setFormData] = useState({ title: "", link: "" });

  const createDownloadMutation = gql`
    mutation CreateDownload($productCode: String!, $title: String!, $link: String!) {
      createProductDownload(productCode: $productCode, title: $title, link: $link) {
        id
        title
        link
      }
    }
  `;

  const createMutation = useMutation({
    mutationFn: async (variables: {
      productCode: string;
      title: string;
      link: string;
    }) =>
      request(import.meta.env.VITE_API_URL, createDownloadMutation, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
      setIsCreateOpen(false);
      setFormData({ title: "", link: "" });
    },
  });

  const updateDownloadMutation = gql`
    mutation UpdateDownload($id: Int!, $title: String!, $link: String!) {
      updateProductDownload(id: $id, title: $title, link: $link) {
        id
        title
        link
      }
    }
  `;

  const updateMutation = useMutation({
    mutationFn: async (variables: { id: number; title: string; link: string }) =>
      request(import.meta.env.VITE_API_URL, updateDownloadMutation, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
      setEditingDownload(null);
      setFormData({ title: "", link: "" });
    },
  });

  const deleteDownloadMutation = gql`
    mutation DeleteDownload($id: Int!) {
      deleteProductDownload(id: $id)
    }
  `;

  const deleteMutation = useMutation({
    mutationFn: async (variables: { id: number }) =>
      request(import.meta.env.VITE_API_URL, deleteDownloadMutation, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-details", productCode] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Download
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {downloads.length > 0 ? (
            downloads.map((download) => (
              <TableRow key={download.id}>
                <TableCell>{download.title}</TableCell>
                <TableCell className="max-w-xs truncate">{download.link}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingDownload(download);
                        setFormData({ title: download.title, link: download.link });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this download?")) {
                          deleteMutation.mutate({ id: parseInt(download.id) });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No downloads found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Download</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., User Manual, Brochure"
              />
            </div>
            <div className="grid gap-2">
              <Label>Link</Label>
              <Input
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                createMutation.mutate({
                  productCode,
                  title: formData.title,
                  link: formData.link,
                });
              }}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingDownload}
        onOpenChange={(open) => !open && setEditingDownload(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Download</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Link</Label>
              <Input
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingDownload(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingDownload) {
                  updateMutation.mutate({
                    id: parseInt(editingDownload.id),
                    title: formData.title,
                    link: formData.link,
                  });
                }
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

