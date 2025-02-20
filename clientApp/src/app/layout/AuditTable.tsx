import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import LoadingComponent from "../../app/layout/LoadingComponent";

interface AuditTableProps {
  filter: string;
  search: string;
  selectedDate: string;
  pageSize: number;
  sortBy: string;
  asc: number;
  page: number;
  onPageChange: (newPage: number) => void;
}

export default observer(function AuditTable({
  filter,
  search,
  selectedDate,
  pageSize,
  sortBy,
  asc,
  page,
  onPageChange,
}: AuditTableProps) {
  const { roadmapStore } = useStore();
  const { logs, loadLogs, loadingInitial } = roadmapStore;

  useEffect(() => {
    loadLogs(
      filter,
      search,
      selectedDate ? new Date(selectedDate).toISOString() : undefined,
      page,
      pageSize,
      sortBy,
      asc
    );

  }, [filter, search, selectedDate, page, pageSize, sortBy, asc]);

  if (loadingInitial) return <LoadingComponent />;

  return (
    <>
      <TableContainer className="shadow-md rounded-lg overflow-hidden min-w-full">
        <Table className="text-sm">
          <TableHead>
            <TableRow className="border-black border-2">
              <TableCell className="font-semibold text-gray-700 text-right">
                UserName
              </TableCell>
              <TableCell className="font-semibold text-gray-700 text-right">
                Action
              </TableCell>
              <TableCell className="font-semibold text-gray-700 text-right">
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="border-2 border-black">
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.logId} className="hover:bg-gray-100">
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>{log.activityAction}</TableCell>
                  <TableCell>
                    {log.createdAt &&
                      new Date(log.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No Audit Logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-center mt-6">
        <Pagination
          count={roadmapStore.totalPages}
          page={roadmapStore.currentPage}
          onChange={(_, newPage) => onPageChange(newPage)}
          color="primary"
        />
      </div>
    </>
  );
});
