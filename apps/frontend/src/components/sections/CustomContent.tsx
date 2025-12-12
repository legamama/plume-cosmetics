import { Container } from "@/components/ui";
import { CustomContentConfig } from "@/types/page-builder";

interface CustomContentProps {
    config?: CustomContentConfig;
}

export function CustomContent({ config }: CustomContentProps) {
    if (!config?.html_content) return null;

    return (
        <div
            className="custom-content-section"
            dangerouslySetInnerHTML={{ __html: config.html_content }}
        />
    );
}
