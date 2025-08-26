import React from "react";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import Loading from "../ui/Loading";
import Button from "../ui/Button";

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  sortable = true,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  actions,
  emptyMessage = "No data available",
}) => {
  const handleSort = (key) => {
    if (!sortable || !onSort) return;

    const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    onSort(key, newOrder);
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="p-8">
          <Loading text="Loading data..." />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="p-8 text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`table-header ${
                  sortable && column.sortable !== false
                    ? "cursor-pointer hover:bg-gray-100"
                    : ""
                }`}
                onClick={() =>
                  column.sortable !== false && handleSort(column.key)
                }
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {sortable && column.sortable !== false && (
                    <div className="flex flex-col">
                      <ChevronUp
                        className={`h-3 w-3 ${
                          sortBy === column.key && sortOrder === "asc"
                            ? "text-primary-600"
                            : "text-gray-400"
                        }`}
                      />
                      <ChevronDown
                        className={`h-3 w-3 ${
                          sortBy === column.key && sortOrder === "desc"
                            ? "text-primary-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="table-header w-16">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`hover:bg-gray-50 transition-colors ${
                onRowClick ? "cursor-pointer" : ""
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="table-cell">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="table-cell">
                  <div className="flex items-center justify-center">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
