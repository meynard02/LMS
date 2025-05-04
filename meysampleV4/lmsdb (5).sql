-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2025 at 10:04 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
  `Status` varchar(20) NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`AdminID`, `AdminFName`, `AdminLName`, `AdminEmail`, `AdminUsername`, `AdminPassword`, `Status`) VALUES
(1, 'Alrashid', 'Rojas', 'c22-4810-01@spist.edu.ph', 'admin', '$2y$10$DXCLRvENeULVrD/ymPuHve6n4tgrDq/7fEPSNrLOmi/uC420jmrHO', 'Active'),
(2, 'Meynard', 'Ocenar', 'c22-4757-01@spist.edu.ph', 'admin1', '$2y$10$lmHB2gXkM7pubDuGZgiVm.zrGxYjnHDDdsOSZR7yK7mI9jhWhE7.2', 'Active'),
(3, 'Trisha', 'Marinduque', 'c22-4775-01@spist.edu.ph', 'admin2', '$2y$10$jwPnjUtVr6Vs7XfsIxfyeeMDw5XklGY/zEa9gi/bHBF7avyc4u1RC', 'Active'),
(4, 'Asher', 'Laxa', 'c22-4731-01@spist.edu.ph', 'admin3', '$2y$10$PDKlqr40Sub6PkcBc/u4SO7L2EdUDzrVf1fUrnMvE6CSSy/0Ac2oa', 'Active'),
(5, 'Mello', 'Delleva', 'c22-4566-01@spist.edu.ph', 'mellodapdap', '$2y$10$MBjfv7gokGunIa37c0KNb.gc2rVKVZADZvzf6tDHOI6mu9arLnNuu', 'Inactive');

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
  `Availability` varchar(50) DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`AccessionNo`, `Title`, `Author`, `Book_CategoryID`, `Photo`, `Description`, `PublishedYear`, `Availability`) VALUES
(123, 'Java', 'Meymey', 1, '67f9d84c0c0ed.jpg', 'Sakit sa ulo', '2004', 'Available'),
(124, 'C++', 'Meynard Ocenar', 1, '67f9e9b3c8cb5.jpg', 'Sakit sa ulo', '2003', 'Available'),
(125, 'Science10', 'Shid', 2, '67fc0ceec1948.png', 'Umay', '2005', 'Available'),
(126, 'English12', 'Shid', 1, '67fbee1fdf096.PNG', 'Bisayang English', '0000', 'Available'),
(127, 'History10', 'Asher', 1, '67fc0d6e756b7.jpg', 'Kapagod', '0000', 'Available'),
(129, 'HTML', 'shid', 1, '67fd060f20312.jpg', 'MAMA MO', '0000', 'Available'),
(130, 'SCIENCE10', 'SHID', 2, NULL, 'HAHA', '0000', 'Available'),
(131, 'AP10', 'SHID', 3, NULL, 'MAP', '0000', 'Available'),
(445, 'gusiom', 'mellogwpas', 1, '680c78a1376c9.png', 'tralala tralili', '0000', 'On Hold');

-- --------------------------------------------------------

--
-- Table structure for table `book_categories`
--

CREATE TABLE `book_categories` (
  `Book_CategoryID` int(100) NOT NULL,
  `Book_Category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book_categories`
--

INSERT INTO `book_categories` (`Book_CategoryID`, `Book_Category`) VALUES
(1, 'Computer'),
(2, 'Religion'),
(3, 'Philosophy'),
(4, 'Languages'),
(5, 'History'),
(6, 'Arts'),
(7, 'Filipino\r\n'),
(8, 'Araling Panlipunan'),
(9, 'Edukasyon sa Pagpapakatao');

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
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transactionID`, `userID`, `accessionNo`, `statusID`, `BorrowedDate`, `DueDate`, `ReturnDate`, `deleteStatus`) VALUES
(8, 54, 123, 6, '2025-04-13 06:32:38', '2025-05-19 00:00:00', '2025-04-16 16:32:20', 1),
(9, 55, 129, 6, '2025-04-15 16:51:43', '2025-04-23 00:50:52', NULL, 1),
(10, 56, 125, 5, '2025-04-15 16:51:43', '2025-04-19 00:50:52', NULL, 0),
(11, 90, 124, 1, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 1),
(12, 90, 123, 6, '2025-05-07 16:00:00', '2025-05-18 00:00:00', '2025-05-10 00:00:00', 1),
(13, 90, 126, 2, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 1),
(14, 52, 127, 3, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 1),
(15, 90, 129, 3, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 0),
(16, 90, 445, 3, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 0),
(17, 52, 123, 1, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 1),
(18, 52, 123, 1, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 1),
(19, 90, 124, 3, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 0),
(20, 90, 123, 1, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 1),
(21, 90, 124, 5, '2025-05-07 16:00:00', '2025-05-18 00:00:00', '2025-05-20 00:00:00', 1),
(23, 90, 124, 3, '2025-05-07 16:00:00', '2025-05-18 00:00:00', NULL, 0);

--
-- Triggers `transaction`
--
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
(39, 26, 90, 4, 123, 0, '0000-00-00 00:00:00');

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

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `Email`, `FirstName`, `LastName`, `Password`, `OTP`, `created_at`, `is_verified`, `Status`) VALUES
(52, 'c22-4757-01@spist.edu.ph', 'Meymey', 'Ocenar', '$2y$10$GWwWegMYW0pW.VG9MdDiDe5YJ.h9HT1nTOj4h/iLx58EBlkHMk7Km', 0, '2025-05-03 06:36:43', 1, 'Active'),
(53, 'c22-4567-01@spist.edu.ph', 'Marione', 'Ramos', '$2y$10$gjZ8K3dxYg3DJ6iZsKnZ/uLSin4kTlqd.kdBHQ.VmcFsOyTDar6/C', 0, '2025-04-07 02:13:44', 1, 'Active'),
(54, 'c22-4731-01@spist.edu.ph', 'Asher', 'Laxa', '$2y$10$NLCG7DNvSFnsGZ0WoOks5uyV0wqL4IHuw23hqNh44IzhFANCL/Kfe', 0, '2025-04-07 02:17:44', 1, 'Active'),
(55, 'c22-4777-01@spist.edu.ph', 'Xzyruzq', 'Sitay', '$2y$10$nQogCpuoIW/I0GgkBPh/Nu0m9aeQwH2y..UJsqowZLgKM.5a4nkzG', 0, '2025-04-26 05:50:22', 1, 'Active'),
(56, 'c22-4775-01@spist.edu.ph', 'Trisha', 'Marinduque', '$2y$10$ra.0QSFY51Xy.sMJO02u6ekYTSKaz3cTb5JqX6dhxfQkbB1TRTHQC', 0, '2025-04-08 10:12:04', 1, 'Active'),
(63, 'c23-4900-01@spist.edu.ph', 'Christian', 'Rillon', '$2y$10$cGT3pCVDIzcnkSu1tKBvVO6DySRa/xOTQw71Y584wzklP.LYbiqe.', 0, '2025-04-12 05:53:02', 1, 'Active'),
(89, 'c22-4808-01@spist.edu.ph', 'Hendrix', 'Hernandez', '$2y$10$3vBAvhSJxAuNo3wym1yHR.BHgkmqidivd8JshC12yGI/MGOLVC5zu', 845847, '2025-04-26 06:06:12', 1, 'Active'),
(90, 'c22-4810-01@spist.edu.ph', 'Shid', 'Rojas', '$2y$10$Us6YLUPL5bVf0ZSp9mb3y.ZLF570htB2OVXUtumoWr/BgVSpRu50S', 0, '2025-05-04 07:30:18', 1, 'Active');

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
-- Indexes for table `dates`
--
ALTER TABLE `dates`
  ADD PRIMARY KEY (`dateID`);

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
  MODIFY `AdminID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `book_categories`
--
ALTER TABLE `book_categories`
  MODIFY `Book_CategoryID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `dates`
--
ALTER TABLE `dates`
  MODIFY `dateID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `statusID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transactionID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `transaction_log`
--
ALTER TABLE `transaction_log`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
