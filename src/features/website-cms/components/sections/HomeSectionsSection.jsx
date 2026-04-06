import FormGroup from "../shared/FormGroup";
import SectionAccordionItem from "./SectionAccordionItem";
import { SECTION_KEYS } from "../../constants/websiteCmsConstants";

const HomeSectionsSection = ({
  sectionForms,
  setSectionForms,
  saveSection,
  sectionsMap,
  sectionMutations,
  uploadMutation,
}) => {
  const handleFormChange = (sectionKey, field, value) => {
    setSectionForms((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <FormGroup title="أقسام الصفحة الرئيسية">
        <p className="mb-6 text-sm text-slate-400">
          قم بتعديل محتوى كل قسم من أقسام الصفحة الرئيسية
        </p>

        <div className="space-y-4">
          {SECTION_KEYS.map((item) => {
            const form = sectionForms[item.key];
            const existing = sectionsMap.get(item.key);

            return (
              <SectionAccordionItem
                key={item.key}
                item={item}
                form={form}
                existing={existing}
                onFormChange={handleFormChange}
                onSave={saveSection}
                onDelete={(id) => sectionMutations.deleteWebsiteSection.mutate(id)}
                uploadMutation={uploadMutation}
              />
            );
          })}
        </div>
      </FormGroup>
    </div>
  );
};

export default HomeSectionsSection;
