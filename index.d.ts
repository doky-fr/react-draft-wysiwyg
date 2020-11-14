// Type definitions for react-draft-wysiwyg 1.13
// Project: https://github.com/jpuri/react-draft-wysiwyg#readme
// Definitions by: imechZhangLY <https://github.com/imechZhangLY>
//                 brunoMaurice <https://github.com/brunoMaurice>
//                 ldanet <https://github.com/ldanet>
//                 Munif Tanjim <https://github.com/MunifTanjim>
//                 Nathan Zeplowitz <https://github.com/n-zeplo>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.9

import * as React from 'react';
import * as Draft from 'draft-js';

export type SyntheticKeyboardEvent = React.KeyboardEvent<{}>;
export type SyntheticEvent = React.SyntheticEvent<{}>;
export type RawDraftContentState = Draft.RawDraftContentState;
export type DraftHandleValue = Draft.DraftHandleValue;
export type DraftDragType = Draft.DraftDragType;

export class EditorState extends Draft.EditorState {}
export class ContentState extends Draft.ContentState {}
export class ContentBlock extends Draft.ContentBlock {}
export class SelectionState extends Draft.SelectionState {}

export interface EditorProps {
    onChange?(contentState: RawDraftContentState): void;
    onEditorStateChange?(editorState: EditorState): void;
    onContentStateChange?(contentState: RawDraftContentState): void;
    initialContentState?: RawDraftContentState;
    defaultContentState?: RawDraftContentState;
    contentState?: RawDraftContentState;
    editorState?: EditorState;
    defaultEditorState?: EditorState;
    toolbarOnFocus?: boolean;
    autoCapitalize?: string;
    autoComplete?: string;
    autoCorrect?: string;
    spellCheck?: boolean;
    stripPastedStyles?: boolean;
    toolbar?: object;
    toolbarCustomButtons?: Array<React.ReactElement<HTMLElement>>;
    toolbarClassName?: string;
    toolbarHidden?: boolean;
    locale?: string;
    localization?: object;
    editorClassName?: string;
    wrapperClassName?: string;
    toolbarStyle?: object;
    editorStyle?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
    uploadCallback?(file: object): Promise<object>;
    onFocus?(event: SyntheticEvent): void;
    onBlur?(event: SyntheticEvent): void;
    onTab?(event: SyntheticKeyboardEvent): void;
    mention?: object;
    hashtag?: object;
    textAlignment?: string;
    readOnly?: boolean;
    tabIndex?: number;
    placeholder?: string;
    ariaLabel?: string;
    ariaOwneeID?: string;
    ariaActiveDescendantID?: string;
    ariaAutoComplete?: string;
    ariaDescribedBy?: string;
    ariaExpanded?: string;
    ariaHasPopup?: string;
    customBlockRenderFunc?(block: ContentBlock): any;
    wrapperId?: number;
    customDecorators?: object[];
    editorRef?(ref: object): void;
    handlePastedText?(
        text: string,
        html: string,
        editorState: EditorState,
        onChange: (editorState: EditorState) => void
    ): boolean;
    customStyleMap?: object;
    customStyleFn?: (style: Draft.DraftInlineStyle, block: ContentBlock) => object;
    handleBeforeInput?: (chars: string, editorState: EditorState, eventTimeStamp: number) => DraftHandleValue;
    handleReturn?: (event: SyntheticKeyboardEvent, editorState: EditorState) => DraftHandleValue;
    handleKeyCommand?: (command: string, editorState: EditorState, eventTimeStamp: number) => DraftHandleValue;
    handlePastedFiles?: (files: any) => DraftHandleValue;
    handleDroppedFiles?: (selection: SelectionState, files: any) => DraftHandleValue;
    handleDrop?: (selection: SelectionState, dataTransfer: any, isInternal: DraftDragType) => DraftHandleValue;
}

export class Editor extends React.Component<EditorProps> {
    constructor(props: Readonly<EditorProps>);
    focusEditor(): void;
}
