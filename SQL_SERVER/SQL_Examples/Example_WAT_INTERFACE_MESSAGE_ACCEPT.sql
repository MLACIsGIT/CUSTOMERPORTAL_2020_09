DECLARE @OUT								INT
DECLARE @WAT_Portal_Owners_ID				INT				= 1038470									-- ez a ups azonositoja a WAT-on. Itt lehetne -1 is, ha egy altalanosan beregisztralt sofor kuldi az uzenetet az altalanosan elerheto WAT-ra.
DECLARE @WAT_Session_ID						VARCHAR(255)	= ''										-- Bevezetesre fog kerulni, mert most e nelkul a mukodes nem biztonsagos.
DECLARE @WAT_User							NVARCHAR(128)	= 'CUST_MA@upshealthcare.com'				-- A felado user azonositoja. Ha e-mail cim, akkor az, ha telefonszam, akkor az.
DECLARE @Array_of_Accepted_Message_IDs		NVARCHAR(MAX)	= '[8, 9, 10]'								-- Array of Accepted WAT_Messages.IDs.
DECLARE @OUT_ErrCode				NVARCHAR(255)
DECLARE @OUT_ErrParams				NVARCHAR(MAX)

EXEC @OUT = WAT_INTERFACE_MESSAGE_ACCEPT	@WAT_Portal_Owners_ID		= @WAT_Portal_Owners_ID,
											@WAT_Session_ID					= @WAT_Session_ID,
											@WAT_User						= @WAT_User,
											@Array_of_Accepted_Message_IDs	= @Array_of_Accepted_Message_IDs,
											@OUT_ErrCode					= @OUT_ErrCode						OUTPUT,
											@OUT_ErrParams					= @OUT_ErrParams					OUTPUT


SELECT @OUT EREDEMENY, @OUT_ErrCode OUT_ErrCode, @OUT_ErrParams OUT_ErrParams
SELECT 'WAT_Messages All', * FROM WAT_Messages	-- Itt lehet megfigyelni, hogy az @Array_of_Accepted_Message_IDs-ben megadott uzenetek le lettek zarva.

