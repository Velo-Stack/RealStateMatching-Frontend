import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MAX_ANIMATED_ROWS = 80;
const DEFAULT_VIRTUALIZATION_THRESHOLD = 80;
const VIRTUALIZATION_OVERSCAN = 8;
const DEFAULT_VIRTUALIZED_ROW_HEIGHT = 88;

const isPresent = (value) => value !== undefined && value !== null && value !== '';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getDefaultRowKey = (row) => {
  const directKey = [
    row?.id,
    row?._id,
    row?.uuid,
    row?.offerId,
    row?.requestId,
    row?.conversationId,
    row?.notificationId,
  ].find(isPresent);

  if (isPresent(directKey)) return String(directKey);

  const compositeKey = [
    row?.createdAt,
    row?.updatedAt,
    row?.type,
    row?.status,
    row?.cityId,
    row?.neighborhoodId,
  ]
    .filter(isPresent)
    .join('|');

  if (compositeKey) return compositeKey;

  return JSON.stringify(row);
};

const getScrollableParent = (element) => {
  if (!element) return window;

  let parent = element.parentElement;
  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }

  return window;
};

const Table = ({
  columns,
  data,
  loading,
  status,
  isFetching,
  error,
  actions,
  onRowClick,
  getRowKey,
  virtualizeThreshold = DEFAULT_VIRTUALIZATION_THRESHOLD,
  virtualizedRowHeight = DEFAULT_VIRTUALIZED_ROW_HEIGHT,
}) => {
  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const isPendingStatus = status === 'pending';
  const isSuccessStatus = status === 'success';
  const isErrorStatus = status === 'error' || Boolean(error);
  const showLoading = loading || isPendingStatus;
  const canShowEmptyState = status
    ? isSuccessStatus && !isFetching && rows.length === 0
    : !showLoading && !isErrorStatus && rows.length === 0;

  const tableContainerRef = useRef(null);
  const tbodyRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState(() => ({
    start: 0,
    end: Math.min(rows.length, virtualizeThreshold),
  }));

  const hasActions = typeof actions === 'function';
  const shouldAnimateRows = rows.length <= MAX_ANIMATED_ROWS;
  const shouldVirtualize = rows.length > virtualizeThreshold;
  const colSpan = columns.length + (hasActions ? 1 : 0);

  const updateVisibleRange = useCallback(() => {
    if (!shouldVirtualize) return;

    if (!tableContainerRef.current || !tbodyRef.current) return;

    const scrollContainer = getScrollableParent(tableContainerRef.current);
    const containerRect =
      scrollContainer === window
        ? { top: 0, bottom: window.innerHeight, height: window.innerHeight }
        : scrollContainer.getBoundingClientRect();
    const rowsRect = tbodyRef.current.getBoundingClientRect();
    const totalHeight = rows.length * virtualizedRowHeight;

    const visibleStartPx = clamp(containerRect.top - rowsRect.top, 0, totalHeight);
    const visibleEndPx = clamp(containerRect.bottom - rowsRect.top, 0, totalHeight);
    const viewportRows = Math.max(
      1,
      Math.ceil(containerRect.height / virtualizedRowHeight),
    );

    if (visibleEndPx <= visibleStartPx) {
      const fallbackEnd = Math.min(
        rows.length,
        viewportRows + VIRTUALIZATION_OVERSCAN,
      );
      setVisibleRange((prev) =>
        prev.start === 0 && prev.end === fallbackEnd
          ? prev
          : { start: 0, end: fallbackEnd },
      );
      return;
    }

    const nextStart = Math.max(
      0,
      Math.floor(visibleStartPx / virtualizedRowHeight) - VIRTUALIZATION_OVERSCAN,
    );
    const nextEnd = Math.min(
      rows.length,
      Math.ceil(visibleEndPx / virtualizedRowHeight) + VIRTUALIZATION_OVERSCAN,
    );

    setVisibleRange((prev) =>
      prev.start === nextStart && prev.end === nextEnd
        ? prev
        : { start: nextStart, end: Math.max(nextStart + 1, nextEnd) },
    );
  }, [rows.length, shouldVirtualize, virtualizedRowHeight]);

  useEffect(() => {
    if (!shouldVirtualize) return undefined;

    const scrollContainer = getScrollableParent(tableContainerRef.current);
    const scrollTarget = scrollContainer === window ? window : scrollContainer;
    scrollTarget.addEventListener('scroll', updateVisibleRange, { passive: true });
    window.addEventListener('resize', updateVisibleRange);

    return () => {
      scrollTarget.removeEventListener('scroll', updateVisibleRange);
      window.removeEventListener('resize', updateVisibleRange);
    };
  }, [rows.length, shouldVirtualize, updateVisibleRange]);

  const { startIndex, visibleRows, topSpacerHeight, bottomSpacerHeight } = useMemo(() => {
    if (!shouldVirtualize) {
      return {
        startIndex: 0,
        visibleRows: rows,
        topSpacerHeight: 0,
        bottomSpacerHeight: 0,
      };
    }

    const start = clamp(visibleRange.start, 0, rows.length);
    const end = clamp(visibleRange.end, start + 1, rows.length);
    const nextVisibleRows = rows.slice(start, end);

    return {
      startIndex: start,
      visibleRows: nextVisibleRows,
      topSpacerHeight: start * virtualizedRowHeight,
      bottomSpacerHeight: Math.max(0, (rows.length - end) * virtualizedRowHeight),
    };
  }, [rows, shouldVirtualize, visibleRange.end, visibleRange.start, virtualizedRowHeight]);

  const renderRow = useCallback(
    (row, rowIndex) => (
      <motion.tr
        key={String((getRowKey && getRowKey(row)) ?? getDefaultRowKey(row))}
        initial={shouldAnimateRows ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={
          shouldAnimateRows
            ? { delay: rowIndex * 0.03 }
            : { duration: 0 }
        }
        onClick={() => onRowClick && onRowClick(row)}
        className={`group transition-colors duration-200 ${onRowClick
            ? "cursor-pointer hover:bg-white/[0.04]"
            : "hover:bg-white/[0.02]"
          }`}
      >
        {columns.map((col, colIndex) => (
          <td
            key={col.key || col.header || `cell-${colIndex}`}
            className="px-6 py-4 text-sm text-slate-300"
          >
            {col.render ? col.render(row) : row[col.key]}
          </td>
        ))}
        {hasActions && (
          <td className="px-6 py-4 text-sm">
            {actions(row)}
          </td>
        )}
      </motion.tr>
    ),
    [actions, columns, getRowKey, hasActions, onRowClick, shouldAnimateRows],
  );

  if (showLoading) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="border-amber-500/30 border-t-amber-500 w-10 h-10 border-2 rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">جاري تحميل البيانات...</span>
          </div>
        </div>
      </div>
    );
  }

  if (canShowEmptyState) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">لا توجد بيانات للعرض</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      <div ref={tableContainerRef} className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0d1117]/60">
              {columns.map((col, index) => (
                <th
                  key={col.key || col.header || `column-${index}`}
                  className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5"
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody ref={tbodyRef} className="divide-y divide-white/5">
            {shouldVirtualize && topSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td colSpan={colSpan} style={{ height: topSpacerHeight, padding: 0 }} />
              </tr>
            )}

            {visibleRows.map((row, rowIndex) => renderRow(row, startIndex + rowIndex))}

            {shouldVirtualize && bottomSpacerHeight > 0 && (
              <tr aria-hidden="true">
                <td colSpan={colSpan} style={{ height: bottomSpacerHeight, padding: 0 }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;



