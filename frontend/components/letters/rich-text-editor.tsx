"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Link as LinkIcon,
    Unlink,
    Quote,
    Undo2,
    Redo2,
    RemoveFormatting,
    Type,
    Heading1,
    Heading2,
    Heading3,
    Palette,
    Highlighter,
    Minus,
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface RichTextEditorProps {
    value?: string
    onChange?: (html: string) => void
    placeholder?: string
    minHeight?: string
    className?: string
}

// ──────────────────────────────────────────────
// Toolbar Button
// ──────────────────────────────────────────────
function ToolbarButton({
    icon: Icon,
    label,
    onClick,
    active = false,
    disabled = false,
}: {
    icon: React.ElementType
    label: string
    onClick: () => void
    active?: boolean
    disabled?: boolean
}) {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault() // prevent losing focus from editor
                            onClick()
                        }}
                        disabled={disabled}
                        className={cn(
                            "inline-flex items-center justify-center rounded-md h-8 w-8 text-sm transition-colors",
                            "hover:bg-muted hover:text-foreground",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            "disabled:pointer-events-none disabled:opacity-40",
                            active && "bg-accent text-accent-foreground shadow-sm"
                        )}
                        aria-label={label}
                    >
                        <Icon className="h-4 w-4" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

// ──────────────────────────────────────────────
// Color Picker (inline)
// ──────────────────────────────────────────────
const TEXT_COLORS = [
    "#000000", "#434343", "#666666", "#999999", "#cccccc",
    "#c0392b", "#e74c3c", "#e67e22", "#f39c12", "#f1c40f",
    "#27ae60", "#2ecc71", "#1abc9c", "#2980b9", "#3498db",
    "#8e44ad", "#9b59b6", "#2c3e50", "#34495e", "#7f8c8d",
]

const HIGHLIGHT_COLORS = [
    "transparent", "#fef3cd", "#fce4ec", "#e8f5e9", "#e3f2fd",
    "#fff9c4", "#ffccbc", "#f3e5f5", "#e0f7fa", "#ede7f6",
    "#c8e6c9", "#ffecb3", "#b2dfdb", "#d1c4e9", "#bbdefb",
]

function ColorPicker({
    icon: Icon,
    label,
    colors,
    onSelect,
}: {
    icon: React.ElementType
    label: string
    colors: string[]
    onSelect: (color: string) => void
}) {
    return (
        <Popover>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "inline-flex items-center justify-center rounded-md h-8 w-8 text-sm transition-colors",
                                    "hover:bg-muted hover:text-foreground",
                                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                )}
                                aria-label={label}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-auto p-3" align="start">
                <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
                <div className="grid grid-cols-5 gap-1.5">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                onSelect(color)
                            }}
                            className={cn(
                                "h-6 w-6 rounded-md border border-border transition-all hover:scale-110 hover:shadow-md",
                                color === "transparent" && "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2NjYyIvPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')]"
                            )}
                            style={{ backgroundColor: color !== "transparent" ? color : undefined }}
                            aria-label={color === "transparent" ? "No color" : color}
                        />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

// ──────────────────────────────────────────────
// Main Editor
// ──────────────────────────────────────────────
export function RichTextEditor({
    value,
    onChange,
    placeholder = "Start writing your letter content...",
    minHeight = "280px",
    className,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
    const [fontSize, setFontSize] = useState("3")

    // Sync value from parent
    useEffect(() => {
        if (editorRef.current && value !== undefined && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value
        }
        // Only run on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ─── Exec Command ───
    const exec = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
        updateActiveFormats()
        triggerChange()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const triggerChange = useCallback(() => {
        if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }, [onChange])

    // ─── Track active formats ───
    const updateActiveFormats = useCallback(() => {
        const formats = new Set<string>()
        if (document.queryCommandState("bold")) formats.add("bold")
        if (document.queryCommandState("italic")) formats.add("italic")
        if (document.queryCommandState("underline")) formats.add("underline")
        if (document.queryCommandState("strikeThrough")) formats.add("strikeThrough")
        if (document.queryCommandState("justifyLeft")) formats.add("justifyLeft")
        if (document.queryCommandState("justifyCenter")) formats.add("justifyCenter")
        if (document.queryCommandState("justifyRight")) formats.add("justifyRight")
        if (document.queryCommandState("justifyFull")) formats.add("justifyFull")
        if (document.queryCommandState("insertUnorderedList")) formats.add("insertUnorderedList")
        if (document.queryCommandState("insertOrderedList")) formats.add("insertOrderedList")
        setActiveFormats(formats)
    }, [])

    const handleInput = useCallback(() => {
        triggerChange()
        updateActiveFormats()
    }, [triggerChange, updateActiveFormats])

    const handleKeyUp = useCallback(() => {
        updateActiveFormats()
    }, [updateActiveFormats])

    const handleMouseUp = useCallback(() => {
        updateActiveFormats()
    }, [updateActiveFormats])

    // ─── Insert Link ───
    const insertLink = useCallback(() => {
        const url = prompt("Enter URL:")
        if (url) {
            exec("createLink", url)
        }
    }, [exec])

    // ─── Format block ───
    const formatBlock = useCallback(
        (tag: string) => {
            exec("formatBlock", tag)
        },
        [exec]
    )

    return (
        <div
            className={cn(
                "rounded-lg border border-border bg-card overflow-hidden transition-colors",
                "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
                className
            )}
        >
            {/* ═══════ TOOLBAR ═══════ */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/40 border-b border-border">
                {/* Undo / Redo */}
                <ToolbarButton icon={Undo2} label="Undo (Ctrl+Z)" onClick={() => exec("undo")} />
                <ToolbarButton icon={Redo2} label="Redo (Ctrl+Y)" onClick={() => exec("redo")} />

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Block Format */}
                <div className="flex items-center">
                    <Select
                        value="p"
                        onValueChange={(val) => formatBlock(val)}
                    >
                        <SelectTrigger className="h-8 w-[130px] text-xs border-0 bg-transparent hover:bg-muted focus:ring-0 shadow-none">
                            <SelectValue placeholder="Paragraph" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="p">
                                <span className="flex items-center gap-2">
                                    <Type className="h-3.5 w-3.5" /> Paragraph
                                </span>
                            </SelectItem>
                            <SelectItem value="h1">
                                <span className="flex items-center gap-2">
                                    <Heading1 className="h-3.5 w-3.5" /> Heading 1
                                </span>
                            </SelectItem>
                            <SelectItem value="h2">
                                <span className="flex items-center gap-2">
                                    <Heading2 className="h-3.5 w-3.5" /> Heading 2
                                </span>
                            </SelectItem>
                            <SelectItem value="h3">
                                <span className="flex items-center gap-2">
                                    <Heading3 className="h-3.5 w-3.5" /> Heading 3
                                </span>
                            </SelectItem>
                            <SelectItem value="blockquote">
                                <span className="flex items-center gap-2">
                                    <Quote className="h-3.5 w-3.5" /> Blockquote
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Font Size */}
                <div className="flex items-center">
                    <Select
                        value={fontSize}
                        onValueChange={(val) => {
                            setFontSize(val)
                            exec("fontSize", val)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[65px] text-xs border-0 bg-transparent hover:bg-muted focus:ring-0 shadow-none">
                            <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">8pt</SelectItem>
                            <SelectItem value="2">10pt</SelectItem>
                            <SelectItem value="3">12pt</SelectItem>
                            <SelectItem value="4">14pt</SelectItem>
                            <SelectItem value="5">18pt</SelectItem>
                            <SelectItem value="6">24pt</SelectItem>
                            <SelectItem value="7">36pt</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Text Formatting */}
                <ToolbarButton
                    icon={Bold}
                    label="Bold (Ctrl+B)"
                    active={activeFormats.has("bold")}
                    onClick={() => exec("bold")}
                />
                <ToolbarButton
                    icon={Italic}
                    label="Italic (Ctrl+I)"
                    active={activeFormats.has("italic")}
                    onClick={() => exec("italic")}
                />
                <ToolbarButton
                    icon={Underline}
                    label="Underline (Ctrl+U)"
                    active={activeFormats.has("underline")}
                    onClick={() => exec("underline")}
                />
                <ToolbarButton
                    icon={Strikethrough}
                    label="Strikethrough"
                    active={activeFormats.has("strikeThrough")}
                    onClick={() => exec("strikeThrough")}
                />

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Colors */}
                <ColorPicker
                    icon={Palette}
                    label="Text Color"
                    colors={TEXT_COLORS}
                    onSelect={(color) => exec("foreColor", color)}
                />
                <ColorPicker
                    icon={Highlighter}
                    label="Highlight Color"
                    colors={HIGHLIGHT_COLORS}
                    onSelect={(color) =>
                        exec("hiliteColor", color === "transparent" ? "transparent" : color)
                    }
                />

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Alignment */}
                <ToolbarButton
                    icon={AlignLeft}
                    label="Align Left"
                    active={activeFormats.has("justifyLeft")}
                    onClick={() => exec("justifyLeft")}
                />
                <ToolbarButton
                    icon={AlignCenter}
                    label="Align Center"
                    active={activeFormats.has("justifyCenter")}
                    onClick={() => exec("justifyCenter")}
                />
                <ToolbarButton
                    icon={AlignRight}
                    label="Align Right"
                    active={activeFormats.has("justifyRight")}
                    onClick={() => exec("justifyRight")}
                />
                <ToolbarButton
                    icon={AlignJustify}
                    label="Justify"
                    active={activeFormats.has("justifyFull")}
                    onClick={() => exec("justifyFull")}
                />

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Lists */}
                <ToolbarButton
                    icon={List}
                    label="Bullet List"
                    active={activeFormats.has("insertUnorderedList")}
                    onClick={() => exec("insertUnorderedList")}
                />
                <ToolbarButton
                    icon={ListOrdered}
                    label="Numbered List"
                    active={activeFormats.has("insertOrderedList")}
                    onClick={() => exec("insertOrderedList")}
                />

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Insert */}
                <ToolbarButton icon={LinkIcon} label="Insert Link" onClick={insertLink} />
                <ToolbarButton icon={Unlink} label="Remove Link" onClick={() => exec("unlink")} />
                <ToolbarButton icon={Minus} label="Horizontal Rule" onClick={() => exec("insertHorizontalRule")} />
                <ToolbarButton icon={Quote} label="Blockquote" onClick={() => formatBlock("blockquote")} />

                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Clear */}
                <ToolbarButton
                    icon={RemoveFormatting}
                    label="Clear Formatting"
                    onClick={() => exec("removeFormat")}
                />
            </div>

            {/* ═══════ EDITOR ═══════ */}
            <div className="relative">
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline="true"
                    aria-label="Letter content editor"
                    className={cn(
                        "px-5 py-4 outline-none text-sm text-foreground leading-relaxed overflow-y-auto",
                        "prose prose-sm dark:prose-invert max-w-none",
                        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-4",
                        "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-3",
                        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-2",
                        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
                        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2",
                        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2",
                        "[&_li]:my-0.5",
                        "[&_a]:text-primary [&_a]:underline",
                        "[&_hr]:my-4 [&_hr]:border-border",
                        "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none"
                    )}
                    style={{ minHeight }}
                    data-placeholder={placeholder}
                    onInput={handleInput}
                    onKeyUp={handleKeyUp}
                    onMouseUp={handleMouseUp}
                    onFocus={updateActiveFormats}
                />
            </div>

            {/* ═══════ STATUS BAR ═══════ */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-muted/30 border-t border-border">
                <span className="text-[10px] text-muted-foreground font-mono">
                    Rich Text • HTML
                </span>
                <span className="text-[10px] text-muted-foreground">
                    {editorRef.current?.innerText?.trim().split(/\s+/).filter(Boolean).length || 0} words
                </span>
            </div>
        </div>
    )
}
