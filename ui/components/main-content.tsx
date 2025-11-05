/**
 * MainContent component serves as the main content area of the application.
 * It provides a flexible layout to display the content passed as children.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be displayed within the main content area.
 * @return {JSX.Element} The rendered MainContent component.
 * @author Cristono Wijaya
 */
export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}