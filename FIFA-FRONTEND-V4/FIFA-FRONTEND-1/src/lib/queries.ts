import { gql } from '@apollo/client';

export const GET_ACTIVE_ATTENDANCE_SETTING = gql`
  query GetActiveAttendanceSetting($companyId: Int!, $date: String) {
    getActiveAttendanceSetting(companyId: $companyId, date: $date) {
      sequenceNumber
      companyId
      firstShiftStart
      firstShiftEnd
      secondShiftStart
      secondShiftEnd
      thirdShiftStart
      thirdShiftEnd
      fourthShiftStart
      fourthShiftEnd
      fifthShiftStart
      fifthShiftEnd
      sixthShiftStart
      sixthShiftEnd
      validityStart
      validityEnd
      isActive
      graceTime
      autoAbsent
      workingDays
    }
  }
`;

export const GET_ACTION_LOGS = gql`
  query GetActionLogs($staffId: ID!, $date: String!) {
    getActionLogs(staffId: $staffId, date: $date) {
      staffId
      date
      action
      timeStamp
      device
      createdBy
    }
  }
`;

export const CREATE_ATTENDANCE_SETTING = gql`
  mutation CreateAttendanceSetting($input: AttendanceSettingInput!) {
    createAttendanceSetting(input: $input) {
      sequenceNumber
      companyId
      isActive
      graceTime
      autoAbsent
      workingDays
    }
  }
`;

export const CHECK_IN = gql`
  mutation CheckIn($input: ActionLogInput!) {
    checkIn(input: $input)
  }
`;

export const CHECK_OUT = gql`
  mutation CheckOut($input: ActionLogInput!) {
    checkOut(input: $input) {
      staffId
      date
      checkInTime
      checkOutTime
      actualWorkHours
      plannedWorkHours
      status
    }
  }
`;

export const GET_ATTENDANCE = gql`
  query GetAttendance($staffId: ID!, $date: String!) {
    getAttendance(staffId: $staffId, date: $date) {
      staffId
      date
      companyId
      personId
      workingHoursStart
      workingHoursEnd
      checkInTime
      checkOutTime
      actualWorkHours
      plannedWorkHours
      status
      shiftNo
    }
  }
`;

// Additional Attendance operations from backend schema

export const GET_ATTENDANCE_BY_STAFF = gql`
  query GetAttendanceByStaff($staffId: ID!, $startDate: String!, $endDate: String!) {
    getAttendanceByStaff(staffId: $staffId, startDate: $startDate, endDate: $endDate) {
      staffId
      date
      companyId
      personId
      workingHoursStart
      workingHoursEnd
      checkInTime
      checkOutTime
      actualWorkHours
      plannedWorkHours
      status
      shiftNo
    }
  }
`;

export const GET_ATTENDANCE_BY_STAFF_PAGINATED = gql`
  query GetAttendanceByStaffPaginated(
    $staffId: ID!
    $startDate: String!
    $endDate: String!
    $page: Int!
    $size: Int!
  ) {
    getAttendanceByStaffPaginated(
      staffId: $staffId
      startDate: $startDate
      endDate: $endDate
      page: $page
      size: $size
    ) {
      content {
        staffId
        date
        companyId
        personId
        workingHoursStart
        workingHoursEnd
        checkInTime
        checkOutTime
        actualWorkHours
        plannedWorkHours
        status
        shiftNo
      }
      totalElements
      totalPages
      number
      size
    }
  }
`;

export const GET_WORK_SUMMARY = gql`
  query GetWorkSummary($staffId: ID!, $startDate: String!, $endDate: String!) {
    getWorkSummary(staffId: $staffId, startDate: $startDate, endDate: $endDate) {
      totalHours
      normalHours
      overtimeHours
    }
  }
`;

export const GET_ATTENDANCE_COUNT_BY_STATUS = gql`
  query GetAttendanceCountByStatus(
    $staffId: ID!
    $status: String!
    $startDate: String!
    $endDate: String!
  ) {
    getAttendanceCountByStatus(
      staffId: $staffId
      status: $status
      startDate: $startDate
      endDate: $endDate
    )
  }
`;

export const GET_ALL_ATTENDANCE_BY_DATE_RANGE = gql`
  query GetAllAttendanceByDateRange($startDate: String!, $endDate: String!) {
    getAllAttendanceByDateRange(startDate: $startDate, endDate: $endDate) {
      staffId
      date
      companyId
      personId
      workingHoursStart
      workingHoursEnd
      checkInTime
      checkOutTime
      actualWorkHours
      plannedWorkHours
      status
      shiftNo
    }
  }
`;

export const GET_ALL_ATTENDANCE_BY_DATE_RANGE_PAGINATED = gql`
  query GetAllAttendanceByDateRangePaginated(
    $startDate: String!
    $endDate: String!
    $page: Int!
    $size: Int!
  ) {
    getAllAttendanceByDateRangePaginated(
      startDate: $startDate
      endDate: $endDate
      page: $page
      size: $size
    ) {
      content {
        staffId
        date
        companyId
        personId
        workingHoursStart
        workingHoursEnd
        checkInTime
        checkOutTime
        actualWorkHours
        plannedWorkHours
        status
        shiftNo
      }
      totalElements
      totalPages
      number
      size
    }
  }
`;

export const GET_ATTENDANCE_REPORT = gql`
  query GetAttendanceReport($staffId: ID!, $startDate: String!, $endDate: String!) {
    getAttendanceReport(staffId: $staffId, startDate: $startDate, endDate: $endDate) {
      staffId
      startDate
      endDate
      totalRecords
      presentCount
      absentCount
      halfDayCount
      leaveCount
      totalHours
      normalHours
      overtimeHours
    }
  }
`;

export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($input: AttendanceInput!) {
    createAttendance(input: $input) {
      staffId
      date
      checkInTime
      checkOutTime
      actualWorkHours
      plannedWorkHours
      status
      shiftNo
    }
  }
`;

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($staffId: ID!, $date: String!, $input: AttendanceInput) {
    updateAttendance(staffId: $staffId, date: $date, input: $input) {
      staffId
      date
      checkInTime
      checkOutTime
      actualWorkHours
      plannedWorkHours
      status
      shiftNo
    }
  }
`;

export const DELETE_ATTENDANCE = gql`
  mutation DeleteAttendance($staffId: ID!, $date: String!) {
    deleteAttendance(staffId: $staffId, date: $date) {
      staffId
      date
      status
    }
  }
`;

export const UPDATE_ATTENDANCE_STATUS_BULK = gql`
  mutation UpdateAttendanceStatusBulk($updates: [StatusUpdateInput!]!) {
    updateAttendanceStatusBulk(updates: $updates)
  }
`;
