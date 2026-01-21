import { BuilderProvider } from "../contexts/BuilderContext";
import { PresentationProvider } from "../contexts/PresentationContext";
import { PropProvider } from "../contexts/PropContext";

export const mountWithProviders = (children, options = {}) => {
    const { builderProps = {}, propProps = {}, presentationProps = {} } = options;
    return mount(
        <BuilderProvider {...builderProps}>
            <PropProvider {...propProps}>
                <PresentationProvider {...presentationProps}>
                    {children}
                </PresentationProvider>
            </PropProvider>
        </BuilderProvider>
    );
}