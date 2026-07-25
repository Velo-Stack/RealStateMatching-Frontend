import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePublicProjectQuery } from "../../features/website/project-details/hooks/usePublicProjectQuery";
import {
  ProjectBreadcrumb,
  ProjectInfoCard,
  ProjectGalleryLightbox,
  ProjectFeaturesServices,
  ProjectMapSection,
  InterestForm,
  UnitsSection,
} from "../../features/website/project-details/components";

const PREVIEW_SOURCE = "rwasihk-cms-preview";

// Placeholder project used while the CMS "إضافة مشروع جديد" editor doesn't have a
// saved project yet — the live preview merges the in-progress form on top of this.
const DEFAULT_PREVIEW_PROJECT = {
  id: "__cms_preview__",
  title: "عنوان المشروع",
  description: "",
  type: "RESIDENTIAL",
  status: "ACTIVE",
  city: "",
  address: "",
  latitude: null,
  longitude: null,
  googleMapsUrl: "",
  areaFrom: null,
  areaTo: null,
  priceFrom: null,
  priceTo: null,
  totalUnits: null,
  completionDate: null,
  ownerName: "",
  licenseNumber: "",
  features: [],
  services: [],
  isActive: true,
  isFeatured: false,
  coverImageUrl: null,
  galleryImages: [],
  projectUnits: [],
  createdAt: new Date().toISOString(),
};

const ProjectDetailsSkeleton = () => (
  <div className="animate-pulse space-y-10 bg-[#f8f9fa] pb-24 font-cairo">
    <div className="relative h-28 bg-[#ebe4db] sm:h-32" />
    <div className="mx-auto max-w-7xl space-y-8 px-4 md:px-16">
      <div className="grid h-72 grid-cols-4 gap-2 md:h-[420px]">
        <div className="col-span-2 row-span-2 rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200" />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="h-80 rounded-2xl bg-gray-200 lg:col-span-3" />
        <div className="h-80 rounded-2xl bg-gray-200 lg:col-span-2" />
      </div>
    </div>
  </div>
);

const ProjectNotFound = () => (
  <div
    className="flex min-h-screen items-center justify-center bg-[#f8f9fa] font-cairo"
    dir="rtl"
  >
    <div className="mx-4 max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">مشروع غير موجود</h2>
      <p className="mb-6 text-sm text-gray-500">
        عذراً، لم نتمكن من العثور على المشروع المطلوب.
      </p>
      <Link
        to="/projects"
        className="inline-block rounded-full bg-[#9d7857] px-8 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#856345]"
      >
        العودة للمشاريع
      </Link>
    </div>
  </div>
);

const ProjectDetails = () => {
  const { slug } = useParams();

  const isPreview = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("cmsPreview") === "1";
  }, []);

  // While previewing from the CMS, don't hit the public API at all — the data
  // comes entirely from the live form via postMessage.
  const { data: project, isLoading, isError } = usePublicProjectQuery(
    isPreview ? null : slug
  );
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [previewOverride, setPreviewOverride] = useState(null);

  // Tell the parent (CMS project editor) that this preview iframe is mounted and
  // ready to receive data, then listen for live "update" (typing) and "scroll"
  // (open a specific accordion section) messages.
  useEffect(() => {
    if (!isPreview) return undefined;

    const handleMessage = (event) => {
      const msg = event.data;
      if (!msg || msg.source !== PREVIEW_SOURCE) return;

      if (msg.type === "update") {
        setPreviewOverride((prev) => ({ ...prev, ...msg.payload }));
        return;
      }

      if (msg.type === "scroll" && msg.anchor) {
        const el = document.getElementById(msg.anchor);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", handleMessage);
    try {
      window.parent?.postMessage({ source: PREVIEW_SOURCE, type: "ready" }, "*");
    } catch {
      // ignore
    }

    return () => window.removeEventListener("message", handleMessage);
  }, [isPreview]);

  const effectiveProject = useMemo(() => {
    if (!isPreview) return project;
    return { ...DEFAULT_PREVIEW_PROJECT, ...previewOverride };
  }, [isPreview, project, previewOverride]);

  const galleryImages = useMemo(() => {
    if (!effectiveProject) return [];
    return [effectiveProject.coverImageUrl, ...(effectiveProject.galleryImages || [])].filter(
      Boolean
    );
  }, [effectiveProject]);

  if (!isPreview) {
    if (isLoading) return <ProjectDetailsSkeleton />;
    if (isError || !project) return <ProjectNotFound />;
  }

  const units = effectiveProject.projectUnits || [];
  const hasMap = Boolean(effectiveProject.latitude && effectiveProject.longitude);

  return (
    <div className="bg-white font-cairo">
      <div id="cms-project-breadcrumb">
        <ProjectBreadcrumb title={effectiveProject.title} />
      </div>

      <section className="bg-[#f8f9fa] px-4 py-8 sm:px-8 sm:py-10 md:px-16">
        <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
          {galleryImages.length > 0 && (
            <div id="cms-project-gallery">
              <ProjectGalleryLightbox
                images={galleryImages}
                title={effectiveProject.title}
              />
            </div>
          )}

          {/* Details + Interest (wider) + sticky Map on the right */}
          <div className="flex flex-col gap-6 lg:flex-row" dir="ltr">
            <div className="min-w-0 flex-[1.7] space-y-5">
              <div id="cms-project-info">
                <ProjectInfoCard project={effectiveProject} />
              </div>
              <div id="cms-project-features">
                <ProjectFeaturesServices
                  features={effectiveProject.features}
                  services={effectiveProject.services}
                />
              </div>

              {units.length > 0 && (
                <div id="cms-project-units">
                  <UnitsSection units={units} onUnitSelect={setSelectedUnit} />
                </div>
              )}

              <div id="cms-project-interest">
                <InterestForm
                  projectId={effectiveProject.id}
                  unitId={selectedUnit?.id}
                  unitCode={selectedUnit?.code}
                />
              </div>
            </div>

            {hasMap && (
              <div
                id="cms-project-map"
                className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[34%] lg:self-start"
              >
                <ProjectMapSection
                  lat={effectiveProject.latitude}
                  lng={effectiveProject.longitude}
                  title={effectiveProject.title}
                  googleMapsUrl={effectiveProject.googleMapsUrl}
                  compact
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
