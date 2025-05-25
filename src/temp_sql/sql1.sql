DECLARE @TypeId INT,
@StatusId int = 2,
@ProcessId int = 1,
@CustomerName varchar(100) = 'TestUser2',
@CustomerAddress varchar(100),
@LocationId int = 4,
@UpdatedUser varchar(30),
@LocalDateTime DATETIME;
exec getLocalDate @LocalDateTime OUTPUT;

Insert into Form(TypeId, StatusId, ProcessId, CustomerName, CustomerAddress,LocationId,CreatedBy,CreatedOn, LastUpdatedBy, LastUpdatedOn)
values
(@TypeId, @StatusId, @ProcessId, @CustomerName, @CustomerAddress, @LocationId, @UpdatedUser, @LocalDateTime, @UpdatedUser, @LocalDateTime);


select * from Form

Insert into FormType values(1, 'Form1')

Create table Location(LocationId int primary key identity (1,1), LocationName varchar(30) not null);

Insert into Location values('Thoothukudi')
select * from form

alter table form add CONSTRAINT FK_Form_Location FOREIGN KEY (LocationId) REFERENCES Location(LocationId);

alter table form alter column LastUpdatedBy varchar(100) not null

StatusId int not null, ProcessId int not null, CustomerName varchar(100) not null, CustomerAddress varchar(100) not null, LocationId int not null;


Select @@IDENTITY



Alter table Activity Alter column CreatedOn DateTime not null;



Select * from Form

Insert into Location values('Nagercoil')


Select * from attachment


Insert into Attachment(Id, FileName, FilePath, FileType, UploadedBy, UploadedOn) values(
@Id, @FileName, @FilePath, @FileType, @UploadedBy, @UploadedOn)
)

Insert into Attachment(Id, FileName, FilePath, FileType, UploadedBy, UploadedOn) values(
@@Identity, @FileName, @FilePath, @FileType, @UploadedBy, @UploadedOn)

Alter table Attachment drop column AttachmentId

Select * from Attachment