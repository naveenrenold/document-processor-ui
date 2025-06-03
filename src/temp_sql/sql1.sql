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
---

DECLARE @FormId INT = 1;
if(@Id IS NULL)
begin

end
else
begin
    UPDATE Form
    SET TypeId = IFF(@TypeId is NULL, TypeId, @TypeId),
        StatusId = IFF(@StatusId is NULL, StatusId, @StatusId),
        ProcessId = IFF(@ProcessId is NULL, ProcessId, @ProcessId),
        CustomerName = IFF(@CustomerName is NULL, CustomerName, @CustomerName),
        CustomerAddress = IFF(@CustomerAddress is NULL, CustomerAddress, @CustomerAddress),
        LocationId = IFF(@LocationId is NULL, LocationId, @LocationId),
        phoneNumber = IFF(@PhoneNumber is NULL, phoneNumber, @PhoneNumber),
        phoneNumber2 = IFF(@PhoneNumber2 is NULL, phoneNumber2, @PhoneNumber2),
        LastUpdatedBy = IFF(@UpdatedUser is NULL, LastUpdatedBy, @UpdatedUser),
        LastUpdatedOn = IFF(@LocalDateTime is NULL, LastUpdatedOn, @LocalDateTime)
    WHERE Id = @FormId;
end

select * from Form