-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2025 at 12:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lmsdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `AdminID` int(100) NOT NULL,
  `AdminFName` varchar(100) NOT NULL,
  `AdminLName` varchar(100) NOT NULL,
  `AdminEmail` varchar(100) NOT NULL,
  `AdminUsername` varchar(100) NOT NULL,
  `AdminPassword` varchar(100) NOT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`AdminID`, `AdminFName`, `AdminLName`, `AdminEmail`, `AdminUsername`, `AdminPassword`, `Status`, `created_at`, `otp_code`, `otp_expiry`) VALUES
(1, 'Alrashid', 'Rojas', 'c22-4810-01@spist.edu.ph', 'admin', '$2y$10$Z5DvGy1pnFObA5xg41klf.IoI.ADYxsC.Uekjv.jk5bk0Jd.TNgtS', 'Active', '2025-05-09 08:33:03', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `AccessionNo` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Author` varchar(255) NOT NULL,
  `Book_CategoryID` int(255) DEFAULT NULL,
  `Photo` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `PublishedYear` year(4) NOT NULL,
  `Availability` varchar(50) DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`AccessionNo`, `Title`, `Author`, `Book_CategoryID`, `Photo`, `Description`, `PublishedYear`, `Availability`, `created_at`) VALUES
(111, 'English10', 'Shid', 11, NULL, ' english', '0000', 'Available', '2025-05-09 09:23:27'),
(123, 'Java', 'Meymey', 1, '67f9d84c0c0ed.jpg', 'for programming', '2004', 'Checked Out', '2025-05-09 09:16:24'),
(124, 'C++', 'Meynard Ocenar', 1, '67f9e9b3c8cb5.jpg', 'for programming', '2003', 'Available', '2025-05-09 09:16:24'),
(127, 'History10', 'Asher', 5, '67fc0d6e756b7.jpg', 'yes', '0000', 'On Hold', '2025-05-09 09:16:24'),
(129, 'HTML', 'shid', 1, '67fd060f20312.jpg', 'for programming', '0000', 'Checked Out', '2025-05-09 09:16:24'),
(131, 'AP10', 'SHID', 5, NULL, 'MAP', '0000', 'Available', '2025-05-09 09:16:24');

-- --------------------------------------------------------

--
-- Table structure for table `book_categories`
--

CREATE TABLE `book_categories` (
  `Book_CategoryID` int(100) NOT NULL,
  `Book_Category` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book_categories`
--

INSERT INTO `book_categories` (`Book_CategoryID`, `Book_Category`, `created_at`) VALUES
(1, 'Computer', '2025-05-09 09:12:41'),
(2, 'Religion', '2025-05-09 09:12:41'),
(3, 'Philosophy', '2025-05-09 09:12:41'),
(4, 'Languages', '2025-05-09 09:12:41'),
(5, 'History', '2025-05-09 09:12:41'),
(6, 'Arts', '2025-05-09 09:12:41'),
(7, 'Filipino\r\n', '2025-05-09 09:12:41'),
(8, 'Araling Panlipunan', '2025-05-09 09:12:41'),
(9, 'Edukasyon sa Pagpapakatao', '2025-05-09 09:12:41'),
(10, 'Math', '2025-05-09 09:12:41'),
(11, 'English', '2025-05-09 09:22:19');

-- --------------------------------------------------------

--
-- Table structure for table `contact_info`
--

CREATE TABLE `contact_info` (
  `ContactID` int(10) NOT NULL,
  `ContactEmail` varchar(100) NOT NULL,
  `ContactTelephone` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_info`
--

INSERT INTO `contact_info` (`ContactID`, `ContactEmail`, `ContactTelephone`) VALUES
(1, 'c22-4810-01@spist.edu.ph', '09123456789');

-- --------------------------------------------------------

--
-- Table structure for table `dates`
--

CREATE TABLE `dates` (
  `dateID` int(100) NOT NULL,
  `dateDesc` varchar(100) NOT NULL,
  `Days` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dates`
--

INSERT INTO `dates` (`dateID`, `dateDesc`, `Days`) VALUES
(1, 'DueDate', 15);

-- --------------------------------------------------------

--
-- Table structure for table `max_books`
--

CREATE TABLE `max_books` (
  `MaxID` int(10) NOT NULL,
  `MaxNumber` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `max_books`
--

INSERT INTO `max_books` (`MaxID`, `MaxNumber`) VALUES
(1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `Notif_ID` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `ID` int(11) NOT NULL,
  `DueDate` datetime NOT NULL,
  `CustomMessage` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_desc`
--

CREATE TABLE `notification_desc` (
  `ID` int(100) NOT NULL,
  `Notif_status` varchar(250) NOT NULL,
  `Notif_title` varchar(100) NOT NULL,
  `Notif_desc` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_desc`
--

INSERT INTO `notification_desc` (`ID`, `Notif_status`, `Notif_title`, `Notif_desc`) VALUES
(1, 'Approved', 'Book Request Approved', 'The book \"%s\" by \"%s\" that you requested has been approved. Please be mindful of your due date.'),
(2, 'Rejected', 'Book Request Rejected', 'The book \"%s\" by \"%s\" that you requested has been rejected due to minor issues.'),
(3, 'Due Date', 'Due Date Reminder', 'The book \"%s\" by \"%s\" that you borrowed is due %s.'),
(5, 'Overdue', 'Book Overdue Notice', 'The book \"%s\" by \"%s\" that you borrowed is overdue. Please return it immediately.');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `statusID` int(10) NOT NULL,
  `StatusDesc` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`statusID`, `StatusDesc`) VALUES
(1, 'Approved'),
(2, 'Rejected'),
(3, 'Pending'),
(4, 'Overdue'),
(5, 'Returned Overdue'),
(6, 'Returned');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transactionID` int(100) NOT NULL,
  `userID` int(100) NOT NULL,
  `accessionNo` int(100) NOT NULL,
  `statusID` int(100) NOT NULL DEFAULT 3,
  `BorrowedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `DueDate` datetime DEFAULT NULL,
  `ReturnDate` datetime DEFAULT NULL,
  `deleteStatus` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `transaction`
--
DELIMITER $$
CREATE TRIGGER `TR_transaction_log_approve` AFTER UPDATE ON `transaction` FOR EACH ROW INSERT INTO transaction_log (TransactionID, UserID,StatusID,AccessionNo,DeleteStatus,Logdate)
        VALUES (NEW.transactionID,NEW.userID,NEW.statusID,NEW.accessionNo,NEW.deleteStatus,current_timestamp())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `TR_transaction_log_insert` AFTER INSERT ON `transaction` FOR EACH ROW INSERT INTO transaction_log (TransactionID, UserID,StatusID,AccessionNo,DeleteStatus,Logdate)
        VALUES (NEW.transactionID,NEW.userID,NEW.statusID,NEW.accessionNo,NEW.deleteStatus,current_timestamp())
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `transaction_log`
--

CREATE TABLE `transaction_log` (
  `LogID` int(11) NOT NULL,
  `TransactionID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `StatusID` int(11) NOT NULL,
  `AccessionNo` int(11) NOT NULL,
  `DeleteStatus` int(11) NOT NULL,
  `Logdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_log`
--

INSERT INTO `transaction_log` (`LogID`, `TransactionID`, `UserID`, `StatusID`, `AccessionNo`, `DeleteStatus`, `Logdate`) VALUES
(1, 8, 54, 3, 123, 1, '2025-04-13 14:32:38'),
(2, 9, 55, 3, 129, 1, '2025-04-16 00:51:43'),
(3, 10, 57, 3, 125, 1, '2025-04-16 00:51:43'),
(4, 11, 90, 3, 124, 1, '2025-05-03 06:02:18'),
(5, 11, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(6, 12, 90, 3, 123, 1, '2025-05-03 06:02:57'),
(7, 12, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(8, 13, 90, 3, 126, 1, '2025-05-03 08:19:40'),
(9, 13, 90, 3, 126, 0, '0000-00-00 00:00:00'),
(10, 14, 52, 3, 127, 1, '2025-05-03 08:36:29'),
(11, 14, 52, 3, 127, 0, '0000-00-00 00:00:00'),
(12, 15, 90, 3, 129, 1, '2025-05-03 10:15:45'),
(13, 15, 90, 3, 129, 0, '0000-00-00 00:00:00'),
(14, 16, 90, 3, 445, 1, '2025-05-03 10:47:09'),
(15, 16, 90, 3, 445, 0, '0000-00-00 00:00:00'),
(16, 17, 52, 3, 123, 1, '2025-05-03 12:15:12'),
(17, 17, 52, 3, 123, 0, '0000-00-00 00:00:00'),
(18, 18, 52, 3, 123, 1, '2025-05-03 12:27:16'),
(19, 18, 52, 3, 123, 0, '0000-00-00 00:00:00'),
(20, 19, 90, 3, 124, 1, '2025-05-03 13:12:48'),
(21, 19, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(22, 20, 90, 3, 123, 1, '2025-05-03 13:16:09'),
(23, 20, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(24, 21, 90, 3, 124, 1, '2025-05-03 13:16:58'),
(25, 21, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(26, 22, 90, 3, 123, 1, '2025-05-03 13:28:15'),
(27, 22, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(28, 23, 90, 3, 124, 1, '2025-05-03 13:29:45'),
(29, 23, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(30, 22, 90, 4, 123, 0, '0000-00-00 00:00:00'),
(31, 24, 90, 3, 123, 1, '2025-05-03 13:38:11'),
(32, 24, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(33, 24, 90, 4, 123, 0, '0000-00-00 00:00:00'),
(34, 25, 90, 3, 123, 1, '2025-05-03 13:38:21'),
(35, 25, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(36, 25, 90, 4, 123, 0, '0000-00-00 00:00:00'),
(37, 26, 90, 3, 123, 1, '2025-05-03 13:40:36'),
(38, 26, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(39, 26, 90, 4, 123, 0, '0000-00-00 00:00:00'),
(40, 27, 52, 3, 123, 1, '2025-05-04 17:13:50'),
(41, 27, 52, 3, 123, 0, '0000-00-00 00:00:00'),
(42, 28, 52, 3, 124, 1, '2025-05-04 17:16:39'),
(43, 28, 52, 3, 124, 0, '0000-00-00 00:00:00'),
(44, 29, 90, 3, 126, 1, '2025-05-04 17:21:17'),
(45, 29, 90, 3, 126, 0, '0000-00-00 00:00:00'),
(46, 19, 90, 4, 124, 0, '0000-00-00 00:00:00'),
(47, 29, 90, 4, 126, 0, '0000-00-00 00:00:00'),
(48, 30, 90, 3, 123, 1, '2025-05-04 17:32:19'),
(49, 30, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(50, 30, 90, 4, 123, 0, '0000-00-00 00:00:00'),
(51, 27, 52, 4, 123, 0, '0000-00-00 00:00:00'),
(52, 31, 90, 3, 123, 1, '2025-05-04 17:39:51'),
(53, 31, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(54, 32, 52, 3, 124, 1, '2025-05-04 17:40:12'),
(55, 32, 52, 3, 124, 0, '0000-00-00 00:00:00'),
(56, 33, 90, 3, 126, 1, '2025-05-04 17:40:52'),
(57, 33, 90, 3, 126, 0, '0000-00-00 00:00:00'),
(58, 34, 52, 3, 127, 1, '2025-05-04 17:41:12'),
(59, 34, 52, 3, 127, 0, '0000-00-00 00:00:00'),
(60, 35, 52, 3, 129, 1, '2025-05-04 18:03:01'),
(61, 35, 52, 3, 129, 0, '0000-00-00 00:00:00'),
(62, 36, 52, 3, 125, 1, '2025-05-04 18:05:42'),
(63, 36, 52, 3, 125, 0, '0000-00-00 00:00:00'),
(64, 37, 52, 3, 125, 1, '2025-05-05 10:16:16'),
(65, 37, 52, 3, 125, 0, '0000-00-00 00:00:00'),
(66, 38, 90, 3, 130, 1, '2025-05-05 10:50:06'),
(67, 38, 90, 3, 130, 0, '0000-00-00 00:00:00'),
(68, 39, 90, 3, 123, 1, '2025-05-05 12:32:15'),
(69, 39, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(70, 40, 90, 3, 124, 1, '2025-05-05 12:32:34'),
(71, 40, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(72, 41, 90, 3, 126, 1, '2025-05-05 12:33:53'),
(73, 41, 90, 3, 126, 0, '0000-00-00 00:00:00'),
(74, 42, 90, 3, 127, 1, '2025-05-05 12:37:03'),
(75, 42, 90, 3, 127, 0, '0000-00-00 00:00:00'),
(76, 43, 90, 3, 129, 1, '2025-05-05 12:39:40'),
(77, 43, 90, 3, 129, 0, '0000-00-00 00:00:00'),
(78, 44, 90, 3, 445, 1, '2025-05-05 12:50:43'),
(79, 44, 90, 3, 445, 0, '0000-00-00 00:00:00'),
(80, 45, 90, 3, 125, 1, '2025-05-05 21:53:31'),
(81, 45, 90, 3, 125, 0, '0000-00-00 00:00:00'),
(82, 46, 90, 3, 123, 1, '2025-05-05 22:40:18'),
(83, 46, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(84, 47, 90, 3, 124, 1, '2025-05-05 22:41:33'),
(85, 47, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(86, 48, 90, 3, 126, 1, '2025-05-05 22:41:57'),
(87, 48, 90, 3, 126, 0, '0000-00-00 00:00:00'),
(88, 49, 90, 3, 127, 1, '2025-05-05 22:43:40'),
(89, 49, 90, 3, 127, 0, '0000-00-00 00:00:00'),
(90, 50, 90, 3, 129, 1, '2025-05-05 23:31:43'),
(91, 50, 90, 3, 129, 0, '0000-00-00 00:00:00'),
(92, 51, 90, 3, 445, 1, '2025-05-06 00:23:44'),
(93, 51, 90, 3, 445, 0, '0000-00-00 00:00:00'),
(94, 51, 90, 1, 445, 1, '2025-05-06 00:24:46'),
(95, 51, 90, 6, 445, 1, '2025-05-06 00:26:03'),
(96, 52, 90, 3, 125, 1, '2025-05-06 11:17:06'),
(97, 52, 90, 3, 125, 0, '0000-00-00 00:00:00'),
(98, 52, 90, 1, 125, 1, '2025-05-06 11:17:27'),
(99, 52, 90, 1, 125, 0, '2025-05-06 11:24:55'),
(100, 53, 90, 3, 125, 1, '2025-05-06 11:25:39'),
(101, 53, 90, 3, 125, 0, '0000-00-00 00:00:00'),
(102, 53, 90, 1, 125, 1, '2025-05-06 11:25:59'),
(103, 54, 90, 3, 130, 1, '2025-05-06 12:37:47'),
(104, 54, 90, 3, 130, 0, '0000-00-00 00:00:00'),
(105, 54, 90, 1, 130, 1, '2025-05-06 12:38:05'),
(106, 55, 90, 3, 445, 1, '2025-05-06 12:52:11'),
(107, 55, 90, 3, 445, 0, '0000-00-00 00:00:00'),
(108, 55, 90, 1, 445, 1, '2025-05-06 13:07:14'),
(109, 56, 90, 3, 123, 1, '2025-05-06 13:10:13'),
(110, 56, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(111, 57, 90, 3, 124, 1, '2025-05-06 13:10:17'),
(112, 57, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(113, 56, 90, 4, 123, 0, '0000-00-00 00:00:00'),
(114, 57, 90, 4, 124, 0, '0000-00-00 00:00:00'),
(115, 58, 90, 3, 123, 1, '2025-05-06 13:10:35'),
(116, 58, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(117, 59, 90, 3, 124, 1, '2025-05-06 13:10:38'),
(118, 59, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(119, 58, 90, 1, 123, 1, '2025-05-06 13:11:05'),
(120, 59, 90, 2, 124, 1, '2025-05-06 13:11:14'),
(121, 58, 90, 6, 123, 1, '2025-05-06 13:11:48'),
(122, 60, 90, 3, 126, 1, '2025-05-06 13:19:07'),
(123, 60, 90, 3, 126, 0, '0000-00-00 00:00:00'),
(124, 60, 90, 1, 126, 1, '2025-05-06 13:22:08'),
(125, 60, 90, 5, 126, 1, '2025-05-06 13:25:38'),
(126, 61, 90, 3, 127, 1, '2025-05-06 13:26:19'),
(127, 61, 90, 3, 127, 0, '0000-00-00 00:00:00'),
(128, 61, 90, 2, 127, 1, '2025-05-06 13:26:40'),
(129, 62, 90, 3, 445, 1, '2025-05-06 14:33:02'),
(130, 62, 90, 3, 445, 0, '0000-00-00 00:00:00'),
(131, 62, 90, 1, 445, 1, '2025-05-06 14:33:17'),
(132, 63, 52, 3, 123, 1, '2025-05-06 15:05:04'),
(133, 63, 52, 3, 123, 0, '0000-00-00 00:00:00'),
(134, 63, 52, 1, 123, 1, '2025-05-06 15:05:25'),
(135, 62, 90, 6, 445, 1, '2025-05-06 15:05:55'),
(136, 63, 52, 5, 123, 1, '2025-05-06 15:06:18'),
(137, 62, 90, 5, 445, 1, '2025-05-06 15:09:06'),
(138, 62, 90, 6, 445, 1, '2025-05-06 15:09:29'),
(139, 62, 90, 5, 445, 1, '2025-05-06 15:11:50'),
(140, 58, 90, 5, 123, 1, '2025-05-06 16:09:53'),
(141, 58, 90, 5, 123, 1, '2025-05-06 16:10:11'),
(142, 58, 90, 6, 123, 1, '2025-05-06 16:10:37'),
(143, 62, 90, 5, 445, 1, '2025-05-06 16:10:53'),
(144, 62, 90, 6, 445, 1, '2025-05-06 16:11:28'),
(145, 60, 90, 6, 126, 1, '2025-05-06 16:11:42'),
(146, 64, 90, 3, 123, 1, '2025-05-06 17:12:43'),
(147, 64, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(148, 64, 90, 1, 123, 1, '2025-05-06 17:12:52'),
(149, 65, 90, 3, 126, 1, '2025-05-06 20:27:37'),
(150, 65, 90, 3, 126, 0, '0000-00-00 00:00:00'),
(151, 65, 90, 1, 126, 1, '2025-05-06 20:27:56'),
(152, 66, 90, 3, 129, 1, '2025-05-06 21:30:38'),
(153, 66, 90, 3, 129, 0, '0000-00-00 00:00:00'),
(154, 66, 90, 1, 129, 1, '2025-05-06 21:30:50'),
(155, 67, 90, 3, 445, 1, '2025-05-06 21:58:44'),
(156, 67, 90, 3, 445, 0, '0000-00-00 00:00:00'),
(157, 67, 90, 1, 445, 1, '2025-05-06 21:58:54'),
(158, 68, 90, 3, 125, 1, '2025-05-06 22:01:03'),
(159, 68, 90, 3, 125, 0, '0000-00-00 00:00:00'),
(160, 69, 90, 3, 130, 1, '2025-05-06 22:01:07'),
(161, 69, 90, 3, 130, 0, '0000-00-00 00:00:00'),
(162, 70, 90, 3, 131, 1, '2025-05-06 22:01:13'),
(163, 70, 90, 3, 131, 0, '0000-00-00 00:00:00'),
(164, 69, 90, 1, 130, 1, '2025-05-06 22:01:33'),
(165, 68, 90, 1, 125, 1, '2025-05-06 22:01:50'),
(166, 70, 90, 1, 131, 1, '2025-05-06 22:02:02'),
(167, 71, 90, 3, 124, 1, '2025-05-06 22:04:20'),
(168, 71, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(169, 71, 90, 1, 124, 1, '2025-05-06 22:04:48'),
(170, 64, 90, 6, 123, 1, '2025-05-06 22:05:00'),
(171, 72, 90, 3, 123, 1, '2025-05-06 22:05:57'),
(172, 72, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(173, 72, 90, 1, 123, 1, '2025-05-06 22:06:14'),
(174, 65, 90, 6, 126, 1, '2025-05-07 12:50:36'),
(175, 66, 90, 6, 129, 1, '2025-05-07 12:50:46'),
(176, 67, 90, 6, 445, 1, '2025-05-07 12:50:55'),
(177, 71, 90, 6, 124, 1, '2025-05-07 12:51:03'),
(178, 70, 90, 5, 131, 1, '2025-05-07 12:51:11'),
(179, 69, 90, 5, 130, 1, '2025-05-07 12:51:29'),
(180, 68, 90, 5, 125, 1, '2025-05-07 12:51:41'),
(181, 72, 90, 6, 123, 1, '2025-05-07 12:52:41'),
(182, 73, 90, 3, 123, 1, '2025-05-07 12:53:29'),
(183, 73, 90, 3, 123, 0, '0000-00-00 00:00:00'),
(184, 73, 90, 1, 123, 1, '2025-05-07 12:53:43'),
(185, 74, 90, 3, 124, 1, '2025-05-07 12:55:34'),
(186, 74, 90, 3, 124, 0, '0000-00-00 00:00:00'),
(187, 74, 90, 1, 124, 1, '2025-05-07 12:55:58'),
(188, 75, 52, 3, 126, 1, '2025-05-07 13:23:06'),
(189, 75, 52, 3, 126, 0, '0000-00-00 00:00:00'),
(190, 75, 52, 1, 126, 1, '2025-05-07 13:23:47'),
(191, 74, 90, 5, 124, 1, '2025-05-07 16:52:30'),
(192, 76, 90, 3, 125, 1, '2025-05-08 18:56:00'),
(193, 76, 90, 3, 125, 0, '0000-00-00 00:00:00'),
(194, 76, 90, 4, 125, 0, '0000-00-00 00:00:00'),
(195, 77, 90, 3, 125, 1, '2025-05-08 18:56:17'),
(196, 77, 90, 3, 125, 0, '0000-00-00 00:00:00'),
(197, 77, 90, 4, 125, 0, '0000-00-00 00:00:00'),
(198, 78, 52, 3, 129, 1, '2025-05-10 00:34:32'),
(199, 78, 52, 3, 129, 0, '0000-00-00 00:00:00'),
(200, 79, 52, 3, 445, 1, '2025-05-10 00:34:37'),
(201, 79, 52, 3, 445, 0, '0000-00-00 00:00:00'),
(202, 80, 52, 3, 125, 1, '2025-05-10 00:34:51'),
(203, 80, 52, 3, 125, 0, '0000-00-00 00:00:00'),
(204, 81, 52, 3, 130, 1, '2025-05-10 00:34:58'),
(205, 81, 52, 3, 130, 0, '0000-00-00 00:00:00'),
(206, 81, 52, 2, 130, 1, '2025-05-10 00:35:25'),
(207, 78, 52, 4, 129, 0, '0000-00-00 00:00:00'),
(208, 79, 52, 4, 445, 0, '0000-00-00 00:00:00'),
(209, 80, 52, 4, 125, 0, '0000-00-00 00:00:00'),
(210, 82, 52, 3, 129, 1, '2025-05-10 00:37:46'),
(211, 82, 52, 3, 129, 0, '0000-00-00 00:00:00'),
(212, 83, 52, 3, 124, 1, '2025-05-10 00:47:16'),
(213, 83, 52, 3, 124, 0, '0000-00-00 00:00:00'),
(214, 84, 52, 3, 445, 1, '2025-05-10 00:47:23'),
(215, 84, 52, 3, 445, 0, '0000-00-00 00:00:00'),
(216, 82, 52, 4, 129, 0, '0000-00-00 00:00:00'),
(217, 83, 52, 4, 124, 0, '0000-00-00 00:00:00'),
(218, 84, 52, 4, 445, 0, '0000-00-00 00:00:00'),
(219, 85, 52, 3, 129, 1, '2025-05-10 01:02:25'),
(220, 85, 52, 3, 129, 0, '0000-00-00 00:00:00'),
(221, 86, 52, 3, 131, 1, '2025-05-10 01:03:12'),
(222, 86, 52, 3, 131, 0, '0000-00-00 00:00:00'),
(223, 87, 52, 3, 445, 1, '2025-05-10 01:06:45'),
(224, 87, 52, 3, 445, 0, '0000-00-00 00:00:00'),
(225, 85, 52, 4, 129, 0, '0000-00-00 00:00:00'),
(226, 86, 52, 4, 131, 0, '0000-00-00 00:00:00'),
(227, 87, 52, 4, 445, 0, '0000-00-00 00:00:00'),
(228, 88, 52, 3, 124, 1, '2025-05-10 01:15:19'),
(229, 88, 52, 3, 124, 0, '0000-00-00 00:00:00'),
(230, 88, 52, 4, 124, 0, '0000-00-00 00:00:00'),
(231, 89, 52, 3, 124, 1, '2025-05-10 01:17:06'),
(232, 89, 52, 3, 124, 0, '0000-00-00 00:00:00'),
(233, 90, 52, 3, 131, 1, '2025-05-10 01:30:37'),
(234, 90, 52, 3, 131, 0, '0000-00-00 00:00:00'),
(235, 91, 52, 3, 111, 1, '2025-05-10 01:30:55'),
(236, 91, 52, 3, 111, 0, '0000-00-00 00:00:00'),
(237, 89, 52, 4, 124, 0, '0000-00-00 00:00:00'),
(238, 90, 52, 4, 131, 0, '0000-00-00 00:00:00'),
(239, 91, 52, 4, 111, 0, '0000-00-00 00:00:00'),
(240, 92, 52, 3, 129, 1, '2025-05-10 01:33:56'),
(241, 92, 52, 3, 129, 0, '0000-00-00 00:00:00'),
(242, 93, 52, 3, 445, 1, '2025-05-10 01:34:00'),
(243, 93, 52, 3, 445, 0, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `OTP` int(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0,
  `Status` varchar(20) NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_notification`
-- (See below for the actual view)
--
CREATE TABLE `vw_notification` (
`Email` varchar(100)
,`Notif_status` varchar(250)
,`Notif_title` varchar(100)
,`CustomMessage` text
,`DueDate` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_transaction`
-- (See below for the actual view)
--
CREATE TABLE `vw_transaction` (
`FirstName` varchar(100)
,`LastName` varchar(100)
,`Email` varchar(100)
,`Title` varchar(255)
,`StatusDesc` varchar(20)
,`borroweddate` timestamp
,`duedate` datetime
,`returndate` datetime
);

-- --------------------------------------------------------

--
-- Structure for view `vw_notification`
--
DROP TABLE IF EXISTS `vw_notification`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_notification`  AS SELECT `b`.`Email` AS `Email`, `a`.`Notif_status` AS `Notif_status`, `a`.`Notif_title` AS `Notif_title`, `b`.`CustomMessage` AS `CustomMessage`, `b`.`DueDate` AS `DueDate` FROM (`notification_desc` `a` join `notification` `b` on(`a`.`ID` = `b`.`ID`)) ;

-- --------------------------------------------------------

--
-- Structure for view `vw_transaction`
--
DROP TABLE IF EXISTS `vw_transaction`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_transaction`  AS SELECT `b`.`FirstName` AS `FirstName`, `b`.`LastName` AS `LastName`, `b`.`Email` AS `Email`, `c`.`Title` AS `Title`, `d`.`StatusDesc` AS `StatusDesc`, `a`.`BorrowedDate` AS `borroweddate`, `a`.`DueDate` AS `duedate`, `a`.`ReturnDate` AS `returndate` FROM (((`transaction` `a` join `user` `b` on(`a`.`userID` = `b`.`UserID`)) join `book` `c` on(`a`.`accessionNo` = `c`.`AccessionNo`)) join `status` `d` on(`a`.`statusID` = `d`.`statusID`)) WHERE `a`.`deleteStatus` = 1 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`AdminID`);

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`AccessionNo`);

--
-- Indexes for table `book_categories`
--
ALTER TABLE `book_categories`
  ADD PRIMARY KEY (`Book_CategoryID`);

--
-- Indexes for table `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`ContactID`);

--
-- Indexes for table `dates`
--
ALTER TABLE `dates`
  ADD PRIMARY KEY (`dateID`);

--
-- Indexes for table `max_books`
--
ALTER TABLE `max_books`
  ADD PRIMARY KEY (`MaxID`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`Notif_ID`);

--
-- Indexes for table `notification_desc`
--
ALTER TABLE `notification_desc`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`statusID`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transactionID`);

--
-- Indexes for table `transaction_log`
--
ALTER TABLE `transaction_log`
  ADD PRIMARY KEY (`LogID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `AdminID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `book_categories`
--
ALTER TABLE `book_categories`
  MODIFY `Book_CategoryID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `contact_info`
--
ALTER TABLE `contact_info`
  MODIFY `ContactID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dates`
--
ALTER TABLE `dates`
  MODIFY `dateID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `max_books`
--
ALTER TABLE `max_books`
  MODIFY `MaxID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `Notif_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `notification_desc`
--
ALTER TABLE `notification_desc`
  MODIFY `ID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `statusID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transactionID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `transaction_log`
--
ALTER TABLE `transaction_log`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
