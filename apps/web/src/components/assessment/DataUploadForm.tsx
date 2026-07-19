import { useRef } from 'react';
import {
  Upload,
  Link2,
  FileSpreadsheet,
  Trash2,
  Loader2,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface FileUpload {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'success' | 'failed';
}

interface DataUploadFormProps {
  datasetType: 'structured' | 'unstructured';
  setDatasetType: (val: 'structured' | 'unstructured') => void;
  datasetLink: string;
  setDatasetLink: (val: string) => void;
  uploadedFiles: FileUpload[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeFile: (fileId: string) => void;
}

export function DataUploadForm({
  datasetType,
  setDatasetType,
  datasetLink,
  setDatasetLink,
  uploadedFiles,
  handleFileUpload,
  removeFile,
}: DataUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-brand-border/60">
        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
          <Upload className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">Dataset Asset Upload</h2>
          <span className="text-xs font-semibold text-brand-slate mt-0.5">
            Upload the dataset CSV files or provide a link for unstructured assets.
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dataset Type Selector Toggle */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-slate mb-3">
            Dataset Structure Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDatasetType('structured')}
                className={`py-3.5 rounded-full border font-bold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none ${
                  datasetType === 'structured'
                    ? 'bg-brand-blue/[0.03] border-brand-blue text-brand-blue'
                    : 'bg-white border-brand-border text-brand-slate hover:border-brand-slate/60'
                }`}
            >
              <FileSpreadsheet className="w-4.5 h-4.5" />
              Structured CSV
            </button>
            <button
              type="button"
              onClick={() => setDatasetType('unstructured')}
                className={`py-3.5 rounded-full border font-bold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none ${
                  datasetType === 'unstructured'
                    ? 'bg-brand-blue/[0.03] border-brand-blue text-brand-blue'
                    : 'bg-white border-brand-border text-brand-slate hover:border-brand-slate/60'
                }`}
            >
              <Link2 className="w-4.5 h-4.5" />
              Unstructured Link
            </button>
          </div>
        </div>

        {/* Upload Mode Area */}
        {datasetType === 'unstructured' ? (
          <div className="space-y-2 animate-fadeIn">
            <Input
              label="Dataset Reference Link *"
              type="url"
              required
              value={datasetLink}
              onChange={(e) => setDatasetLink(e.target.value)}
              placeholder="https://example.com/unstructured-data-url"
              icon={<Link2 className="w-4 h-4" />}
            />
            <p className="text-[10px] font-semibold text-brand-slate leading-normal pl-1">
              Please provide a valid accessible URL where the unstructured dataset files are hosted.
            </p>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            {/* Drag & Drop Zone */}
            <div
              onClick={triggerFileSelect}
              className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-brand-border hover:border-brand-blue/50 bg-brand-bg-start/10 hover:bg-brand-bg-start/30 rounded-[24px] cursor-pointer transition-all duration-205 select-none"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-11 h-11 rounded-full bg-brand-bg-start flex items-center justify-center text-brand-slate mb-3.5">
                  <Upload className="w-5.5 h-5.5" />
                </div>
                <p className="text-sm font-bold text-brand-navy">Click to upload CSV files</p>
                <p className="text-xs font-semibold text-brand-slate mt-1.5">
                  Only comma-separated values (.csv) are accepted
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded Files Table */}
            {uploadedFiles.length > 0 && (
              <div className="border border-brand-border rounded-[24px] overflow-hidden shadow-xs">
                <div className="bg-brand-bg-start/60 px-5 py-3 border-b border-brand-border">
                  <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">
                    Uploaded Files
                  </span>
                </div>
                <div className="divide-y divide-brand-border bg-white">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex justify-between items-center px-5 py-3.5 text-sm"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <FileCheck className="w-5 h-5 text-brand-blue shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-brand-navy truncate pr-2 max-w-[200px] md:max-w-md">
                            {file.name}
                          </span>
                          <span className="text-[10px] font-semibold text-brand-slate mt-0.5">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {/* Status Tags */}
                        {file.status === 'pending' && (
                          <span className="text-[11px] font-semibold text-brand-slate flex items-center gap-1.5 bg-brand-bg-start px-2.5 py-1 rounded-full border border-brand-border animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin text-brand-blue" />
                            Validating...
                          </span>
                        )}
                        {file.status === 'success' && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                            ✓ Validated
                          </span>
                        )}
                        {file.status === 'failed' && (
                          <span
                            className="text-[11px] font-bold text-red-600 flex items-center gap-1 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full"
                            title="Validation failed: file must be a non-empty CSV"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            Verification Failed
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="p-2 hover:bg-red-50 text-brand-slate hover:text-red-600 border border-transparent hover:border-red-100 rounded-full transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
