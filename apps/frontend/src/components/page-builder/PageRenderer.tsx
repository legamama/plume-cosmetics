import { PageDefinition } from "@/types/page-builder";
import { SectionRenderer } from "./SectionRenderer";

interface PageRendererProps {
    page: PageDefinition;
}

export function PageRenderer({ page }: PageRendererProps) {
    if (!page || !page.sections || page.sections.length === 0) {
        return null;
    }

    // Sort by position just in case
    const sortedSections = [...page.sections].sort((a, b) => a.position - b.position);

    return (
        <div className="flex flex-col w-full">
            {sortedSections.map((section) => (
                <SectionRenderer key={section.id} section={section} />
            ))}
        </div>
    );
}
